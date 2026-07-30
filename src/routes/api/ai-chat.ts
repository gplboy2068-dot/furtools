import { createFileRoute } from "@tanstack/react-router";
import { getAssistant } from "@/data/ai-assistants";
import { executeAICompletion, type ChatMessage as AIChatMessage } from "@/lib/ai-provider";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  assistant?: string;
  messages?: ChatMessage[];
  provider?: string;
  apiKey?: string;
  model?: string;
}

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
        const safeMessages: AIChatMessage[] = incoming
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-30)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 6000) }));

        if (safeMessages.length === 0) return json({ error: "No messages provided." }, 400);

        const messages: AIChatMessage[] = [
          { role: "system", content: assistant.systemPrompt },
          ...safeMessages,
        ];

        const result = await executeAICompletion({
          provider: body.provider,
          apiKey: body.apiKey,
          model: body.model,
          messages,
          temperature: 0.7,
        });

        if (result.error) {
          return json({ error: result.error }, result.status);
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
