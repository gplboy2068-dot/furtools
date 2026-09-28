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
