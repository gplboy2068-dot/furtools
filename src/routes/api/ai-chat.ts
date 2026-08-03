import { createFileRoute } from "@tanstack/react-router";
import { getAssistant } from "@/data/ai-assistants";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  assistant?: string;
  messages?: ChatMessage[];
}

const MODEL = "google/gemini-3.5-flash";

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: RequestBody;
        try {
          body = (await request.json()) as RequestBody;
        } catch {
          return json({ error: "Invalid JSON body." }, 400);
        }

        const assistant = body.assistant ? getAssistant(body.assistant) : undefined;
        if (!assistant) return json({ error: "Unknown assistant." }, 400);

        const incoming = Array.isArray(body.messages) ? body.messages : [];
        const safeMessages = incoming
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-30)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 6000) }));

        if (safeMessages.length === 0) return json({ error: "No messages provided." }, 400);

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return json({ error: "AI is not configured." }, 500);

        const messages = [
          { role: "system" as const, content: assistant.systemPrompt },
          ...safeMessages,
        ];

        let upstream: Response;
        try {
          upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
            },
            body: JSON.stringify({
              model: MODEL,
              messages,
              temperature: 0.7,
            }),
          });
        } catch (err) {
          return json({ error: "Could not reach the AI service." }, 502);
        }

        if (!upstream.ok) {
          if (upstream.status === 429)
            return json({ error: "You're sending messages too quickly. Please wait a moment." }, 429);
          if (upstream.status === 402)
            return json({ error: "AI credits are exhausted for this workspace. Please add credits to continue." }, 402);
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
