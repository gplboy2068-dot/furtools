import { createFileRoute } from "@tanstack/react-router";
import { executeAICompletion } from "@/lib/ai-provider";

interface RequestBody {
  image?: string; // data URL
  prompt?: string;
  system?: string;
  provider?: string;
  model?: string;
  apiKey?: string;
}

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

        const result = await executeAICompletion({
          provider: body.provider,
          model: body.model,
          apiKey: body.apiKey,
          messages,
          temperature: 0.5,
        });

        if (result.error) {
          return json({ error: result.error }, result.status || 500);
        }

        return json({ content: result.content });
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
