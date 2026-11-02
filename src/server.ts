import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

import { setWorkerEnv } from "./lib/cloudflare-context";
import { FALLBACK_FOODS } from "./data/fallback-foods";
import { FALLBACK_BREEDS } from "./data/fallback-breeds";

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const cfEnv =
      env ||
      (globalThis as any).__env__ ||
      (globalThis as any).__CF_ENV__ ||
      (request as any)?.runtime?.cloudflare?.env;
    setWorkerEnv(cfEnv);

    const url = new URL(request.url);

    // Canonical Domain 301 Redirect:
    // Seamlessly redirect any traffic hitting the *.workers.dev subdomain
    // to the official primary domain https://www.furtools.com
    if (url.hostname.endsWith(".workers.dev")) {
      const target = new URL(request.url);
      target.hostname = "www.furtools.com";
      target.protocol = "https:";
      target.port = "";
      return Response.redirect(target.toString(), 301);
    }

    // Direct Google Auth Verification Endpoint
    if (url.pathname === "/api/auth/google-verify" && request.method === "POST") {
      try {
        const body = (await request.json()) as { credential?: string };
        const credential = body?.credential;
        if (!credential) {
          return new Response(JSON.stringify({ success: false, error: "Missing credential" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
        );
        if (!verifyRes.ok) {
          return new Response(JSON.stringify({ success: false, error: "Invalid Google token" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        const info = (await verifyRes.json()) as any;
        const user = {
          googleId: info.sub,
          email: info.email,
          name: info.name || info.email,
          picture: info.picture || "",
          givenName: info.given_name || "",
          familyName: info.family_name || "",
          emailVerified: info.email_verified === "true" || info.email_verified === true,
        };

        return new Response(JSON.stringify({ success: true, user }), {
          headers: { "content-type": "application/json" },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: err?.message || "Verification failed" }),
          { status: 500, headers: { "content-type": "application/json" } }
        );
      }
    }

    // Fast-path API: D1 Auth (signup / signin / signout / session / google / bootstrap-admin)
    if (url.pathname.startsWith("/api/auth/d1/")) {
      const jsonRes = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
      try {
        const { getD1 } = await import("./lib/cloudflare-context");
        const db = getD1();
        if (!db) return jsonRes({ error: "Database not available" }, 500);

        const ensureTables = async () => {
          await db.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT, google_id TEXT, display_name TEXT, avatar_url TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))").run();
          await db.prepare("CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))").run();
          await db.prepare("CREATE TABLE IF NOT EXISTS profiles (id TEXT PRIMARY KEY, display_name TEXT, avatar_url TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')))").run();
          await db.prepare("CREATE TABLE IF NOT EXISTS user_roles (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', created_at TEXT DEFAULT (datetime('now')))").run();
        };
        await ensureTables();

        const sha256Hex = async (text: string) => {
          const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
          return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
        };
        const randomHex = (bytes: number) =>
          Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map((b) => b.toString(16).padStart(2, "0")).join("");
        const b64encode = (buf: ArrayBuffer | Uint8Array) => {
          const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
          let s = ""; for (const b of bytes) s += String.fromCharCode(b);
          return btoa(s);
        };
        const b64decode = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
        const hashPassword = async (password: string) => {
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
          const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt as BufferSource, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
          return `pbkdf2$100000$${b64encode(salt)}$${b64encode(bits)}`;
        };
        const verifyPassword = async (password: string, stored: string) => {
          try {
            const [, iterStr, saltB64, hashB64] = stored.split("$");
            const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
            const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: b64decode(saltB64) as BufferSource, iterations: parseInt(iterStr, 10) || 100000, hash: "SHA-256" }, keyMaterial, 256);
            const expected = b64decode(hashB64);
            const actual = new Uint8Array(bits);
            if (expected.length !== actual.length) return false;
            let diff = 0; for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
            return diff === 0;
          } catch { return false; }
        };
        // Deterministic UUID for Google users — must match googleIdToUuid() in src/lib/custom-google-auth.ts
        const googleIdToUuid = (input: string) => {
          let hash = 0;
          for (let i = 0; i < input.length; i++) { const ch = input.charCodeAt(i); hash = ((hash << 5) - hash) + ch; hash |= 0; }
          const hex = Math.abs(hash).toString(16).padStart(8, "0");
          const full = (hex + hex + hex + hex).slice(0, 32);
          return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-a${full.slice(17, 20)}-${full.slice(20, 32)}`;
        };
        const upsertProfileRole = async (userId: string, name: string, avatar: string) => {
          await db.prepare("INSERT INTO profiles (id, display_name, avatar_url) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, avatar_url = excluded.avatar_url, updated_at = datetime('now')").bind(userId, name || null, avatar || null).run();
          const existing = await db.prepare("SELECT id FROM user_roles WHERE user_id = ? LIMIT 1").bind(userId).first();
          if (!existing) await db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'user')").bind(crypto.randomUUID(), userId).run();
        };
        const rolesOf = async (userId: string): Promise<string[]> => {
          const { results } = await db.prepare("SELECT role FROM user_roles WHERE user_id = ?").bind(userId).all();
          return (results || []).map((r: any) => r.role as string);
        };
        const publicUser = async (u: any) => ({
          id: u.id as string,
          email: u.email as string,
          name: (u.display_name as string) || String(u.email).split("@")[0],
          avatarUrl: (u.avatar_url as string) || "",
          roles: await rolesOf(u.id),
        });
        const createSession = async (userId: string) => {
          const token = randomHex(32);
          const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await db.prepare("INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256Hex(token), userId, expires).run();
          return token;
        };
        const sessionUser = async () => {
          const authHeader = request.headers.get("authorization") || "";
          let token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
          if (!token) {
            const cookie = request.headers.get("cookie") || "";
            const m = cookie.match(/furtools_d1_auth=([^;]+)/);
            if (m) token = decodeURIComponent(m[1]);
          }
          if (!token) return null;
          const row = await db.prepare("SELECT u.* FROM auth_sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > datetime('now') LIMIT 1").bind(await sha256Hex(token)).first();
          return row || null;
        };
        const readBody = async () => { try { return (await request.json()) as any; } catch { return {}; } };
        const action = url.pathname.replace("/api/auth/d1/", "");

        if (action === "session" && request.method === "GET") {
          const u = await sessionUser();
          return jsonRes({ user: u ? await publicUser(u) : null });
        }
        if (action === "signout" && request.method === "POST") {
          const authHeader = request.headers.get("authorization") || "";
          const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
          if (token) await db.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
          return jsonRes({ success: true });
        }
        if (action === "signup" && request.method === "POST") {
          const body = await readBody();
          const email = String(body.email || "").trim().toLowerCase();
          const password = String(body.password || "");
          const displayName = String(body.displayName || "").trim() || email.split("@")[0];
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonRes({ error: "Please enter a valid email address." }, 400);
          if (password.length < 8) return jsonRes({ error: "Password must be at least 8 characters." }, 400);
          const existing = (await db.prepare("SELECT id, password_hash FROM users WHERE email = ? LIMIT 1").bind(email).first()) as any;
          if (existing) {
            if (existing.password_hash) return jsonRes({ error: "An account with this email already exists — sign in instead." }, 409);
            // Google-only account: let the user set a password on it
            await db.prepare("UPDATE users SET password_hash = ?, display_name = COALESCE(display_name, ?), updated_at = datetime('now') WHERE id = ?").bind(await hashPassword(password), displayName, existing.id).run();
            const u = await db.prepare("SELECT * FROM users WHERE id = ?").bind(existing.id).first();
            const token = await createSession(existing.id);
            return jsonRes({ success: true, token, user: await publicUser(u) });
          }
          const id = crypto.randomUUID();
          await db.prepare("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)").bind(id, email, await hashPassword(password), displayName).run();
          await upsertProfileRole(id, displayName, "");
          const u = (await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first()) as any;
          const token = await createSession(id);
          return jsonRes({ success: true, token, user: await publicUser(u) });
        }
        if (action === "signin" && request.method === "POST") {
          const body = await readBody();
          const email = String(body.email || "").trim().toLowerCase();
          const password = String(body.password || "");
          const u = (await db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").bind(email).first()) as any;
          if (!u) return jsonRes({ error: "Invalid email or password." }, 401);
          if (!u.password_hash) return jsonRes({ error: "This account was created with Google sign-in — please use the Google button." }, 400);
          if (!(await verifyPassword(password, u.password_hash as string))) return jsonRes({ error: "Invalid email or password." }, 401);
          const token = await createSession(u.id);
          return jsonRes({ success: true, token, user: await publicUser(u) });
        }
        if (action === "google" && request.method === "POST") {
          const body = await readBody();
          let profile: { sub: string; email: string; name: string; picture: string } | null = null;
          if (body.credential) {
            const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=<redacted>}`);
            if (!verifyRes.ok) return jsonRes({ error: "Invalid Google token" }, 401);
            const info: any = await verifyRes.json();
            const allowedAud = ["426028123282-fo5a37hr1r05pia9oh99tu38iuefiqlk.apps.googleusercontent.com", (cfEnv as any)?.VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || ""];
            if (!allowedAud.includes(info.aud)) return jsonRes({ error: "Google token audience mismatch" }, 401);
            if (!(info.email_verified === "true" || info.email_verified === true)) return jsonRes({ error: "Google email is not verified" }, 401);
            profile = { sub: info.sub, email: String(info.email).toLowerCase(), name: info.name || info.email, picture: info.picture || "" };
          } else if (body.accessToken) {
            const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${body.accessToken}` } });
            if (!infoRes.ok) return jsonRes({ error: "Invalid Google access token" }, 401);
            const info: any = await infoRes.json();
            profile = { sub: info.sub, email: String(info.email).toLowerCase(), name: info.name || info.email, picture: info.picture || "" };
          }
          if (!profile) return jsonRes({ error: "Missing Google credential" }, 400);
          let u = (await db.prepare("SELECT * FROM users WHERE google_id = ? LIMIT 1").bind(profile.sub).first()) as any;
          if (!u) u = (await db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").bind(profile.email).first()) as any;
          if (!u) {
            const id = googleIdToUuid(profile.sub);
            await db.prepare("INSERT INTO users (id, email, google_id, display_name, avatar_url) VALUES (?, ?, ?, ?, ?)").bind(id, profile.email, profile.sub, profile.name, profile.picture).run();
            u = (await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first()) as any;
          } else {
            await db.prepare("UPDATE users SET google_id = COALESCE(google_id, ?), display_name = COALESCE(display_name, ?), avatar_url = COALESCE(avatar_url, ?), updated_at = datetime('now') WHERE id = ?").bind(profile.sub, profile.name, profile.picture, u.id).run();
            u = (await db.prepare("SELECT * FROM users WHERE id = ?").bind(u.id).first()) as any;
          }
          await upsertProfileRole(u.id, profile.name, profile.picture);
          const token = await createSession(u.id);
          const pub = await publicUser(u);
          return jsonRes({ success: true, token, user: { ...pub, picture: pub.avatarUrl, googleId: profile.sub } });
        }
        if (action === "role-fix" && request.method === "POST") {
          // TEMPORARY token-gated role repair (remove after admin setup is complete).
          const ROLEFIX_TOKEN_SHA256 = "e69a0fdf0693c569426e005058bd85753c3781816a9ca28a71a94b7462c7393b";
          const presented = request.headers.get("x-bootstrap-token") || "";
          if (!presented || (await sha256Hex(presented)) !== ROLEFIX_TOKEN_SHA256) return jsonRes({ error: "Forbidden" }, 403);
          const body = await readBody();
          const email = String(body.email || "").trim().toLowerCase();
          const u = (await db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").bind(email).first()) as any;
          if (!u) return jsonRes({ error: "No D1 account with that email" }, 404);
          await db.prepare("DELETE FROM user_roles WHERE user_id = ?").bind(u.id).run();
          const role = body.admin === true ? "admin" : "user";
          await db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)").bind(crypto.randomUUID(), u.id, role).run();
          return jsonRes({ success: true, email, role });
        }
        if (action === "bootstrap-admin" && request.method === "POST") {
          // One-time admin bootstrap: token-gated and self-disabling once any admin exists.
          const BOOTSTRAP_TOKEN_SHA256 = "e69a0fdf0693c569426e005058bd85753c3781816a9ca28a71a94b7462c7393b";
          const presented = request.headers.get("x-bootstrap-token") || "";
          if (!presented || (await sha256Hex(presented)) !== BOOTSTRAP_TOKEN_SHA256) return jsonRes({ error: "Forbidden" }, 403);
          const anyAdmin = await db.prepare("SELECT id FROM user_roles WHERE role = 'admin' LIMIT 1").first();
          if (anyAdmin) return jsonRes({ error: "An admin already exists — bootstrap is disabled." }, 409);
          const body = await readBody();
          const email = String(body.email || "").trim().toLowerCase();
          const u = (await db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").bind(email).first()) as any;
          if (!u) return jsonRes({ error: "No D1 account with that email — sign up first." }, 404);
          await db.prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')").bind(crypto.randomUUID(), u.id).run();
          return jsonRes({ success: true, email, role: "admin" });
        }
        return jsonRes({ error: "Unknown auth action" }, 404);
      } catch (err: any) {
        console.error("D1 auth error:", err);
        return jsonRes({ error: err?.message || "Auth failed" }, 500);
      }
    }

    // Fast-path API: Pets (Cloudflare D1)
    if (url.pathname === "/api/pets") {
      try {
        const { getDbPets, getDbPetById, insertDbPet, updateDbPet, deleteDbPet } = await import("./lib/d1");

        if (request.method === "GET") {
          const id = url.searchParams.get("id");
          const userId = url.searchParams.get("userId");
          if (id) {
            const pet = await getDbPetById(id);
            if (!pet) return new Response(JSON.stringify({ error: "Pet not found" }), { status: 404, headers: { "content-type": "application/json" } });
            return new Response(JSON.stringify(pet), { headers: { "content-type": "application/json" } });
          }
          if (userId) {
            const list = await getDbPets(userId);
            return new Response(JSON.stringify(list), { headers: { "content-type": "application/json" } });
          }
          return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
        }

        if (request.method === "POST") {
          const body = await request.json();
          if (!body?.name || !body?.user_id) {
            return new Response(JSON.stringify({ error: "Missing required pet fields" }), { status: 400, headers: { "content-type": "application/json" } });
          }
          const created = await insertDbPet(body);
          return new Response(JSON.stringify(created), { status: 201, headers: { "content-type": "application/json" } });
        }

        if (request.method === "PUT") {
          const body = await request.json();
          if (!body?.id) {
            return new Response(JSON.stringify({ error: "Missing pet id" }), { status: 400, headers: { "content-type": "application/json" } });
          }
          await updateDbPet(body.id, body);
          return new Response(JSON.stringify({ success: true }), { headers: { "content-type": "application/json" } });
        }

        if (request.method === "DELETE") {
          const id = url.searchParams.get("id");
          if (!id) {
            return new Response(JSON.stringify({ error: "Missing pet id" }), { status: 400, headers: { "content-type": "application/json" } });
          }
          await deleteDbPet(id);
          return new Response(JSON.stringify({ success: true }), { headers: { "content-type": "application/json" } });
        }
      } catch (err: any) {
        console.error("D1 /api/pets error:", err);
        return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), { status: 500, headers: { "content-type": "application/json" } });
      }
    }

    // Fast-path API: Pet Sub-records (Vaccinations, meds, weight, visits, etc.)
    if (url.pathname === "/api/pet-records") {
      try {
        const { getDbPetRecords, insertDbPetRecord, deleteDbPetRecord } = await import("./lib/d1");
        const table = url.searchParams.get("table") || "";

        if (request.method === "GET") {
          const petId = url.searchParams.get("petId") || "";
          const records = await getDbPetRecords(table, petId);
          return new Response(JSON.stringify(records), { headers: { "content-type": "application/json" } });
        }

        if (request.method === "POST") {
          const body = await request.json();
          const targetTable = body?.table || table;
          const created = await insertDbPetRecord(targetTable, body?.record || body);
          return new Response(JSON.stringify(created), { status: 201, headers: { "content-type": "application/json" } });
        }

        if (request.method === "PUT") {
          const body = await request.json();
          const targetTable = body?.table || table;
          const id = body?.id || url.searchParams.get("id");
          if (!id) {
            return new Response(JSON.stringify({ error: "Missing record id" }), { status: 400, headers: { "content-type": "application/json" } });
          }
          const { updateDbPetRecord } = await import("./lib/d1");
          await updateDbPetRecord(targetTable, id, body?.updates || body);
          return new Response(JSON.stringify({ success: true }), { headers: { "content-type": "application/json" } });
        }

        if (request.method === "DELETE") {
          const id = url.searchParams.get("id") || "";
          await deleteDbPetRecord(table, id);
          return new Response(JSON.stringify({ success: true }), { headers: { "content-type": "application/json" } });
        }
      } catch (err: any) {
        console.error("D1 /api/pet-records error:", err);
        return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), { status: 500, headers: { "content-type": "application/json" } });
      }
    }

    // Fast-path API: Foods
    if (url.pathname === "/api/foods") {
      try {
        const { getDbFoods } = await import("./lib/d1");
        const foods = await getDbFoods();
        const data = foods && foods.length > 0 ? foods : FALLBACK_FOODS;
        return new Response(JSON.stringify(data), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=1800, s-maxage=3600",
            "access-control-allow-origin": "*",
          },
        });
      } catch (err) {
        console.warn("API foods error, serving fallback:", err);
        return new Response(JSON.stringify(FALLBACK_FOODS), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=1800, s-maxage=3600",
            "access-control-allow-origin": "*",
          },
        });
      }
    }

    // Fast-path API: Breeds
    if (url.pathname === "/api/breeds") {
      try {
        const { getDbBreeds } = await import("./lib/d1");
        const breeds = await getDbBreeds();
        const data = breeds && breeds.length > 0 ? breeds : FALLBACK_BREEDS;
        return new Response(JSON.stringify(data), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=1800, s-maxage=3600",
            "access-control-allow-origin": "*",
          },
        });
      } catch (err) {
        console.warn("API breeds error, serving fallback:", err);
        return new Response(JSON.stringify(FALLBACK_BREEDS), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=1800, s-maxage=3600",
            "access-control-allow-origin": "*",
          },
        });
      }
    }

    // Fast-path API: Blog Posts List
    if (url.pathname === "/api/blog" && request.method === "GET") {
      try {
        const { getDbBlogPosts } = await import("./lib/d1");
        const posts = await getDbBlogPosts();
        if (posts && posts.length > 0) {
          return new Response(JSON.stringify(posts), {
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "public, max-age=1800, s-maxage=3600",
              "access-control-allow-origin": "*",
            },
          });
        }
      } catch (err) {
        console.warn("API blog error, serving fallback:", err);
      }
      const { STATIC_BLOG_POSTS } = await import("./data/blog-posts");
      const fallbackList = Object.values(STATIC_BLOG_POSTS).map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_image: p.cover_image,
        category: p.category,
        published_at: p.published_at,
        tags: p.tags,
      }));
      return new Response(JSON.stringify(fallbackList), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "public, max-age=1800, s-maxage=3600",
          "access-control-allow-origin": "*",
        },
      });
    }

    // Fast-path API: Single Blog Post
    if (url.pathname.startsWith("/api/blog/") && request.method === "GET") {
      const slug = url.pathname.replace(/^\/api\/blog\//, "");
      try {
        const { getDbBlogPostBySlug } = await import("./lib/d1");
        const post = await getDbBlogPostBySlug(slug);
        if (post) {
          const { STATIC_BLOG_POSTS } = await import("./data/blog-posts");
          const staticPost = STATIC_BLOG_POSTS[slug];
          return new Response(
            JSON.stringify({
              ...post,
              faqs: staticPost?.faqs || [],
              author: "Firoz Khan",
              author_id: post.author_id || "firoz-khan",
            }),
            {
              headers: {
                "content-type": "application/json; charset=utf-8",
                "cache-control": "public, max-age=1800, s-maxage=3600",
                "access-control-allow-origin": "*",
              },
            }
          );
        }
      } catch (err) {
        console.warn(`API blog slug error (${slug}):`, err);
      }
      const { STATIC_BLOG_POSTS } = await import("./data/blog-posts");
      const fallbackPost = STATIC_BLOG_POSTS[slug];
      if (fallbackPost) {
        return new Response(JSON.stringify(fallbackPost), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "public, max-age=1800, s-maxage=3600",
            "access-control-allow-origin": "*",
          },
        });
      }
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }

    // Fast-path API: R2 Upload
    if (url.pathname === "/api/upload" && request.method === "POST") {
      try {
        const { uploadToR2 } = await import("./lib/r2");
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const key = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const buffer = await file.arrayBuffer();
        await uploadToR2(key, buffer, {
          httpMetadata: { contentType: file.type },
        });
        return new Response(
          JSON.stringify({
            success: true,
            key,
            url: `/api/assets/${key}`,
          }),
          {
            headers: { "content-type": "application/json" },
          }
        );
      } catch (err) {
        console.error("R2 upload error:", err);
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }

    // Fast-path API: R2 Asset Delivery
    if (url.pathname.startsWith("/api/assets/") && request.method === "GET") {
      try {
        const { getFromR2 } = await import("./lib/r2");
        const key = url.pathname.replace(/^\/api\/assets\//, "");
        const obj = await getFromR2(key);
        if (!obj) {
          return new Response("Asset not found", { status: 404 });
        }
        const headers = new Headers();
        obj.writeHttpMetadata(headers);
        headers.set("etag", obj.httpEtag);
        headers.set("cache-control", "public, max-age=31536000, immutable");
        return new Response(obj.body, { headers });
      } catch (err) {
        return new Response("Error retrieving asset", { status: 500 });
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
