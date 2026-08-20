import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { executeAICompletion } from "@/lib/ai-provider";

interface RequestBody {
  species?: string;
  vibe?: string;
  count?: number;
  ai?: boolean;
  provider?: string;
  model?: string;
  apiKey?: string;
}

const MAX_COUNT = 20;
const VALID = /^[a-z0-9-]{2,32}$/;

export const Route = createFileRoute("/api/generate-names")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: RequestBody;
        try {
          body = (await request.json()) as RequestBody;
        } catch {
          return json({ error: "Invalid JSON body." }, 400);
        }

        const species = String(body.species ?? "").toLowerCase().trim();
        const vibe = String(body.vibe ?? "").toLowerCase().trim();
        const count = Math.max(1, Math.min(MAX_COUNT, Number(body.count) || 12));
        const wantAi = body.ai !== false;

        if (!VALID.test(species) || !VALID.test(vibe)) {
          return json({ error: "Invalid species or vibe." }, 400);
        }

        const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const serviceKey =
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        let supabase = null;
        if (url && serviceKey) {
          supabase = createClient(url, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });
        }

        // 1. Existing stored names for this species+vibe
        let storedNames: Array<{ name: string; meaning: string | null }> = [];
        if (supabase) {
          try {
            const { data: stored } = await supabase
              .from("generated_names")
              .select("name, meaning")
              .eq("species", species)
              .eq("vibe", vibe)
              .order("created_at", { ascending: false })
              .limit(120);

            if (stored) {
              storedNames = stored.map((r) => ({
                name: r.name as string,
                meaning: r.meaning as string | null,
              }));
            }
          } catch {
            /* ignore db fetch error */
          }
        }

        if (!wantAi) return json({ names: storedNames, added: 0 });

        // 2. Ask AI to generate `count` fresh names, avoiding duplicates
        const avoid = storedNames.slice(0, 60).map((n) => n.name).join(", ");
        const systemPrompt = `You generate creative pet names. Reply ONLY with strict JSON of shape {"names":[{"name":"...","meaning":"short 4-8 word note"}, ...]}. No prose, no markdown.`;
        const userPrompt = `Generate ${count} unique, memorable ${vibe} names for a ${species}. Each name must be 1-2 words, easy to call out loud. Include a brief 4-8 word meaning or origin. Avoid these existing names: ${avoid || "none"}.`;

        const result = await executeAICompletion({
          provider: body.provider,
          model: body.model,
          apiKey: body.apiKey,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.9,
          response_format: { type: "json_object" },
        });

        if (result.error) {
          return json({ names: storedNames, added: 0, error: result.error }, 200);
        }

        let cleanContent = result.content.trim();
        if (cleanContent.startsWith("```json")) {
          cleanContent = cleanContent.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanContent.startsWith("```")) {
          cleanContent = cleanContent.replace(/^```/, "").replace(/```$/, "").trim();
        }

        let parsed: { names?: Array<{ name?: string; meaning?: string }> } = {};
        try {
          parsed = JSON.parse(cleanContent);
        } catch {
          return json({ names: storedNames, added: 0, error: "AI returned malformed data." }, 200);
        }

        const fresh = (parsed.names ?? [])
          .map((n) => ({
            name: String(n?.name ?? "").trim().slice(0, 40),
            meaning: String(n?.meaning ?? "").trim().slice(0, 120) || null,
          }))
          .filter((n) => n.name.length >= 2 && n.name.length <= 40);

        if (fresh.length === 0) return json({ names: storedNames, added: 0 });

        // 3. Insert into shared pool if supabase is available
        let added = 0;
        if (supabase) {
          try {
            const rows = fresh.map((n) => ({ species, vibe, name: n.name, meaning: n.meaning, source: "ai" }));
            const { data: inserted } = await supabase
              .from("generated_names")
              .upsert(rows, { onConflict: "species,vibe,name_key", ignoreDuplicates: true })
              .select("name, meaning");

            added = inserted?.length ?? 0;
          } catch {
            /* ignore db insert errors */
          }
        }

        // 4. Return merged list (fresh first)
        const combined = [
          ...fresh,
          ...storedNames.filter((s) => !fresh.some((f) => f.name.toLowerCase() === s.name.toLowerCase())),
        ];

        return json({ names: combined, added });
      },
    },
  },
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
