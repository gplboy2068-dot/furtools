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
