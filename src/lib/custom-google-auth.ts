import { supabase } from "@/integrations/supabase/client";

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
}

export interface ActiveUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isCustomGoogle?: boolean;
}

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
  const userUuid = googleIdToUuid(user.googleId || user.email);

  try {
    await (supabase.from("profiles") as any).upsert({
      id: userUuid,
      display_name: user.name || user.email.split("@")[0],
      avatar_url: user.picture,
      email: user.email,
    }, { onConflict: "id" });
  } catch (err) {
    console.error("Failed to sync profile:", err);
  }

  try {
    await supabase.from("user_roles").upsert({
      user_id: userUuid,
      role: "user",
    }, { onConflict: "user_id,role" });
  } catch (err) {
    console.error("Failed to sync user role (RLS policy check required):", err);
  }
}

/**
 * Custom Session Storage Management
 */
export function saveCustomSession(user: GoogleUserProfile, token: string): CustomAuthSession {
  const session: CustomAuthSession = {
    user,
    token,
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

  // Trigger async background sync to Supabase profiles database
  syncGoogleUserToDatabase(user);

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
  }
}

/**
 * Unified Active User Resolver (checks both Custom Google Auth and Supabase Auth)
 */
export async function getActiveUser(): Promise<ActiveUser | null> {
  // 1. Check custom Google session
  const customSession = getCustomSession();
  if (customSession) {
    // Ensure profile is synced to database
    syncGoogleUserToDatabase(customSession.user);
    return {
      id: customSession.user.googleId,
      email: customSession.user.email,
      name: customSession.user.name,
      avatarUrl: customSession.user.picture,
      isCustomGoogle: true,
    };
  }

  // 2. Check Supabase auth session
  try {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.display_name || data.user.email || 'User',
        avatarUrl: data.user.user_metadata?.avatar_url,
        isCustomGoogle: false,
      };
    }
  } catch {
    /* ignore error */
  }

  return null;
}

/**
 * Generate Google OAuth 2.0 Auth URL for direct popup/redirect
 */
export function getGoogleOAuthUrl(clientId: string, redirectUri: string): string {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'id_token token',
    prompt: 'select_account',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export function handleGoogleRedirectResult(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hash = window.location.hash.substring(1);
    if (!hash) return false;
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    if (idToken) {
      const profile = decodeGoogleJwt(idToken);
      if (profile) {
        saveCustomSession(profile, idToken);
        return true;
      }
    }
  } catch (e) {
    console.error('Failed to parse Google redirect hash:', e);
  }
  return false;
}

