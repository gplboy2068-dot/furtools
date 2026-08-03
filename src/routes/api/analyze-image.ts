import { createFileRoute } from "@tanstack/react-router";

interface RequestBody {
  image?: string; // data URL
  prompt?: string;
  system?: string;
}

const MODEL = "google/gemini-3.5-flash";

export const Route = createFileRoute("/api/analyze-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: RequestBody;
        try {
          body = (await request.json()) as RequestBody;
        } catch {
          return json({ error: "Invalid JSON body." }, 400);
        }

        const image = typeof body.image === "string" ? body.image : "";
        const prompt = (typeof body.prompt === "string" ? body.prompt : "").slice(0, 4000);
        const system = (typeof body.system === "string" ? body.system : "").slice(0, 4000);

        if (!image.startsWith("data:image/")) {
          return json({ error: "Please attach a valid image (JPG, PNG or WebP)." }, 400);
        }
        if (image.length > 8_000_000) {
          return json({ error: "Image is too large. Please use one under 6 MB." }, 400);
        }
        if (!prompt) return json({ error: "Missing analysis prompt." }, 400);

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return json({ error: "AI is not configured." }, 500);

        const messages = [
          {
            role: "system" as const,
            content:
              (system || "You are an experienced pet-care educator.") +
              "\n\nStrict rules: You are NEVER a substitute for a licensed veterinarian. Never diagnose disease. Frame every finding as an educational observation and always advise consulting a vet for medical concerns. Be practical, kind and specific. Use short paragraphs and bullet points. End with a one-line disclaimer.",
          },
          {
            role: "user" as const,
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ];

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
            },
            body: JSON.stringify({ model: MODEL, messages, temperature: 0.5 }),
          });
        } catch {
          return json({ error: "Could not reach the AI service." }, 502);
        }

        if (!upstream.ok) {
          if (upstream.status === 429)
            return json({ error: "Too many requests — please wait a moment and try again." }, 429);
          if (upstream.status === 402)
            return json({ error: "AI credits are exhausted for this workspace." }, 402);
          const text = await upstream.text().catch(() => "");
          return json({ error: `AI service error (${upstream.status}). ${text.slice(0, 200)}` }, 502);
        }

        const data = (await upstream.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const content = data.choices?.[0]?.message?.content?.trim() ?? "";
        if (!content) return json({ error: "AI returned an empty response." }, 502);

        return json({ content });
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
