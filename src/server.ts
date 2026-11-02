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

    // TEMPORARY one-time Supabase backup export (token-gated). Remove after use.
    if (url.pathname === "/api/export-backup-7f3a" && request.method === "GET") {
      const EXPORT_TOKEN_SHA256 = "e69a0fdf0693c569426e005058bd85753c3781816a9ca28a71a94b7462c7393b";
      const presented = request.headers.get("x-export-token") || "";
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(presented));
      const presentedHash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
      if (!presented || presentedHash !== EXPORT_TOKEN_SHA256) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "content-type": "application/json" } });
      }
      const envAny = (cfEnv as any) || {};
      const supaUrl = envAny.SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
      const serviceKey = envAny.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
      if (!supaUrl || !serviceKey) {
        return new Response(JSON.stringify({ error: "Supabase env not configured on worker", hasUrl: Boolean(supaUrl), hasServiceKey: Boolean(serviceKey) }), { status: 500, headers: { "content-type": "application/json" } });
      }
      const headers: Record<string, string> = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };
      const TABLES = ["ads_placements","affiliate_links","analytics_events","blog_posts","breeds","category_overrides","email_templates","faqs","foods","generated_names","internal_links","media","newsletter_subscribers","pet_health_logs","pet_reminders","pets","profiles","site_settings","species_catalog","tool_overrides","user_roles"];
      const countOf = async (table: string): Promise<number | null> => {
        const r = await fetch(`${supaUrl}/rest/v1/${table}?select=*&limit=0`, { headers: { ...headers, Prefer: "count=exact" } });
        if (!r.ok) return null;
        const cr = r.headers.get("content-range") || "";
        const total = parseInt(cr.split("/")[1] || "", 10);
        return Number.isFinite(total) ? total : null;
      };
      try {
        const table = url.searchParams.get("table");
        if (url.searchParams.get("debug") === "1") {
          const probe = await fetch(`${supaUrl}/rest/v1/blog_posts?select=*&limit=1`, { headers: { ...headers, Prefer: "count=exact" } });
          const probeText = (await probe.text()).slice(0, 300);
          const authProbe = await fetch(`${supaUrl}/auth/v1/health`, { headers });
          return new Response(JSON.stringify({ restStatus: probe.status, restBody: probeText, authHealthStatus: authProbe.status }), { headers: { "content-type": "application/json" } });
        }
        if (!table) {
          const counts: Record<string, number | null> = {};
          for (const t of TABLES) counts[t] = await countOf(t);
          let authTotal: number | null = null;
          try {
            const ar = await fetch(`${supaUrl}/auth/v1/admin/users?page=1&per_page=1`, { headers });
            if (ar.ok) { const aj: any = await ar.json(); authTotal = typeof aj.total === "number" ? aj.total : (aj.users?.length ?? null); }
          } catch { /* ignore */ }
          return new Response(JSON.stringify({ exported_at: new Date().toISOString(), tables: counts, auth_users: authTotal }), { headers: { "content-type": "application/json" } });
        }
        if (table === "__auth_users") {
          const users: any[] = [];
          let page = 1;
          for (;;) {
            const r = await fetch(`${supaUrl}/auth/v1/admin/users?page=${page}&per_page=100`, { headers });
            if (!r.ok) return new Response(JSON.stringify({ table, error: `auth admin ${r.status}` }), { status: 502, headers: { "content-type": "application/json" } });
            const j: any = await r.json();
            const batch = j.users || [];
            users.push(...batch);
            if (batch.length < 100) break;
            page++;
          }
          return new Response(JSON.stringify({ table: "auth_users", total: users.length, rows: users }), { headers: { "content-type": "application/json" } });
        }
        if (!TABLES.includes(table)) {
          return new Response(JSON.stringify({ error: "Unknown table" }), { status: 400, headers: { "content-type": "application/json" } });
        }
        const total = await countOf(table);
        if (total === null) {
          return new Response(JSON.stringify({ table, total: null, rows: [], note: "table missing or not readable" }), { headers: { "content-type": "application/json" } });
        }
        const rows: any[] = [];
        const PAGE = 200;
        for (let offset = 0; offset < total; offset += PAGE) {
          const r = await fetch(`${supaUrl}/rest/v1/${table}?select=*&limit=${PAGE}&offset=${offset}`, { headers });
          if (!r.ok) return new Response(JSON.stringify({ table, error: `rest ${r.status} at offset ${offset}` }), { status: 502, headers: { "content-type": "application/json" } });
          const batch: any = await r.json();
          if (!Array.isArray(batch) || batch.length === 0) break;
          rows.push(...batch);
        }
        return new Response(JSON.stringify({ table, total, rows }), { headers: { "content-type": "application/json" } });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message || "Export failed" }), { status: 500, headers: { "content-type": "application/json" } });
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
