export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  givenName?: string;
  familyName?: string;
  emailVerified?: boolean;
}

export interface CustomAuthSession {
  user: GoogleUserProfile;
  token: string;
  expiresAt: number;
  /** D1 session token (server-issued) once exchanged/created */
  d1Token?: string;
  /** D1 user id */
  userId?: string;
  provider?: "google" | "email";
}

export interface ActiveUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isCustomGoogle?: boolean;
  roles?: string[];
  provider?: "google" | "email";
}

export function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    try { window.dispatchEvent(new Event("furtools-auth-changed")); } catch { /* ignore */ }
  }
}

const D1_COOKIE = "furtools_d1_auth";

const SESSION_KEY = 'furtools_custom_google_session';
export const DEFAULT_GOOGLE_CLIENT_ID =
  typeof process !== 'undefined' && process.env.VITE_GOOGLE_CLIENT_ID
    ? process.env.VITE_GOOGLE_CLIENT_ID
    : '426028123282-fo5a37hr1r05pia9oh99tu38iuefiqlk.apps.googleusercontent.com';

/**
 * Decode JWT ID Token payload from Google without external library
 */
export function decodeGoogleJwt(token: string): GoogleUserProfile | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture || '',
      givenName: payload.given_name,
      familyName: payload.family_name,
      emailVerified: payload.email_verified,
    };
  } catch (err) {
    console.error('Failed to decode Google JWT token:', err);
    return null;
  }
}

export function googleIdToUuid(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const full = (hex + hex + hex + hex).slice(0, 32);
  return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-a${full.slice(17, 20)}-${full.slice(20, 32)}`;
}

export async function syncGoogleUserToDatabase(user: GoogleUserProfile): Promise<void> {
  // Profiles/roles now live in D1. The actual sync happens when the Google
  // credential is exchanged for a D1 session in exchangeD1GoogleSession().
}

/**
 * Exchange a Google credential/access token for a server-issued D1 session.
 * Stores the D1 token in the saved session so admin/roles can be verified
 * server-side. Fire-and-forget from saveCustomSession.
 */
export async function exchangeD1GoogleSession(googleCredentialOrAccessToken: string): Promise<void> {
  if (typeof window === "undefined" || !googleCredentialOrAccessToken) return;
  try {
    const isJwt = googleCredentialOrAccessToken.split(".").length === 3;
    const res = await fetch("/api/auth/d1/google", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(isJwt ? { credential: googleCredentialOrAccessToken } : { accessToken: googleCredentialOrAccessToken }),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data?.token) return;
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: CustomAuthSession = JSON.parse(stored);
      session.d1Token = data.token;
      session.userId = data.user?.id;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    document.cookie = `${D1_COOKIE}=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    notifyAuthChanged();
  } catch { /* ignore — local Google session still works for identity */ }
}

/**
 * Custom Session Storage Management
 */
export function saveCustomSession(user: GoogleUserProfile, token: string): CustomAuthSession {
  const session: CustomAuthSession = {
    user,
    token,
    provider: "google",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      document.cookie = `furtools_custom_auth=${token}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {
      console.error('Failed to store custom session:', e);
    }
  }

  // Exchange the Google token for a D1 session (profiles/roles live in D1 now)
  exchangeD1GoogleSession(token);
  notifyAuthChanged();

  return session;
}

export function getCustomSession(): CustomAuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session: CustomAuthSession = JSON.parse(stored);
    if (Date.now() > session.expiresAt) {
      clearCustomSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearCustomSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = 'furtools_custom_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `${D1_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    notifyAuthChanged();
  }
}

/* ───────── D1 email/password auth ───────── */

interface D1AuthResponseUser { id: string; email: string; name: string; avatarUrl?: string; roles?: string[] }

function saveEmailSession(user: D1AuthResponseUser, token: string): CustomAuthSession {
  const profile: GoogleUserProfile = {
    googleId: "",
    email: user.email,
    name: user.name || user.email,
    picture: user.avatarUrl || "",
  };
  const session: CustomAuthSession = {
    user: profile,
    token,
    d1Token: token,
    userId: user.id,
    provider: "email",
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    document.cookie = `furtools_custom_auth=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `${D1_COOKIE}=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
  }
  notifyAuthChanged();
  return session;
}

async function d1AuthPost(path: string, body: unknown): Promise<{ token: string; user: D1AuthResponseUser }> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data;
}

export async function signUpWithEmail(email: string, password: string): Promise<ActiveUser> {
  const data = await d1AuthPost("/api/auth/d1/signup", { email, password });
  saveEmailSession(data.user, data.token);
  return { id: data.user.id, email: data.user.email, name: data.user.name, avatarUrl: data.user.avatarUrl, roles: data.user.roles, provider: "email", isCustomGoogle: false };
}

export async function signInWithEmail(email: string, password: string): Promise<ActiveUser> {
  const data = await d1AuthPost("/api/auth/d1/signin", { email, password });
  saveEmailSession(data.user, data.token);
  return { id: data.user.id, email: data.user.email, name: data.user.name, avatarUrl: data.user.avatarUrl, roles: data.user.roles, provider: "email", isCustomGoogle: false };
}

export async function signOutFromD1(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const session = getCustomSession();
      const token = session?.d1Token || (session?.provider === "email" ? session?.token : "");
      if (token) {
        await fetch("/api/auth/d1/signout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      }
    } catch { /* ignore */ }
  }
  clearCustomSession();
}

/** Server-verified session user (with D1 roles) — used for admin gating. */
export async function fetchD1SessionUser(): Promise<ActiveUser | null> {
  if (typeof window === "undefined") return null;
  try {
    const session = getCustomSession();
    const token = session?.d1Token || (session?.provider === "email" ? session?.token : "");
    if (!token) return null;
    const res = await fetch("/api/auth/d1/session", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.user) return null;
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      avatarUrl: data.user.avatarUrl,
      roles: data.user.roles || [],
      provider: session?.provider,
      isCustomGoogle: session?.provider === "google",
    };
  } catch {
    return null;
  }
}

/**
 * Unified Active User Resolver (local session: D1 email auth or custom Google auth)
 */
export async function getActiveUser(): Promise<ActiveUser | null> {
  const session = getCustomSession();
  if (!session) return null;
  if (session.provider === "email") {
    return {
      id: session.userId || "",
      email: session.user.email,
      name: session.user.name,
      avatarUrl: session.user.picture,
      isCustomGoogle: false,
      provider: "email",
    };
  }
  const userUuid = session.userId || googleIdToUuid(session.user.googleId || session.user.email);
  return {
    id: userUuid,
    email: session.user.email,
    name: session.user.name,
    avatarUrl: session.user.picture,
    isCustomGoogle: true,
    provider: "google",
  };
}

/**
 * Generate Google OAuth 2.0 Auth URL for direct popup/redirect
 */
export function getGoogleOAuthUrl(clientId: string, redirectUri: string): string {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    // NOTE: access_type=offline is only valid with response_type=code; with
    // 'id_token token' Google rejects the request (Error 400 invalid_request).
    response_type: 'id_token token',
    prompt: 'select_account',
    nonce,
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function handleGoogleRedirectResult(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const hash = window.location.hash.substring(1);
    const search = window.location.search.substring(1);
    const params = new URLSearchParams(hash || search);
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');

    if (idToken) {
      const profile = decodeGoogleJwt(idToken);
      if (profile) {
        saveCustomSession(profile, idToken);
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch { /* ignore */ }
        return true;
      }
    }

    if (accessToken) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const info = await res.json();
          const profile: GoogleUserProfile = {
            googleId: info.sub,
            email: info.email,
            name: info.name || info.email,
            picture: info.picture || '',
            givenName: info.given_name,
            familyName: info.family_name,
            emailVerified: info.email_verified,
          };
          saveCustomSession(profile, accessToken);
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch { /* ignore */ }
          return true;
        }
      } catch (err) {
        console.error('Failed to fetch Google userinfo:', err);
      }
    }
  } catch (e) {
    console.error('Failed to parse Google redirect params:', e);
  }
  return false;
}


