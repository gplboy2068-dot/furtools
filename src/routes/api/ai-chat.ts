import { createFileRoute } from "@tanstack/react-router";
import { getAssistant } from "@/data/ai-assistants";
import { executeAICompletion } from "@/lib/ai-provider";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  assistant?: string;
  messages?: ChatMessage[];
  system?: string;
  provider?: string;
  model?: string;
  apiKey?: string;
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
        const systemPrompt = assistant?.systemPrompt || body.system || "You are an expert, compassionate pet care assistant.";

        const incoming = Array.isArray(body.messages) ? body.messages : [];
        const safeMessages = incoming
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-30)
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 6000) }));

        if (safeMessages.length === 0) return json({ error: "No messages provided." }, 400);

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...safeMessages,
        ];

        const result = await executeAICompletion({
          provider: body.provider,
          model: body.model,
          apiKey: body.apiKey,
          messages,
          temperature: 0.7,
        });

        if (result.error) {
          return json({ error: result.error }, result.status || 500);
        }

        const content = result.content;
        return json({
          content,
          message: content,
          choices: [{ message: { role: "assistant", content } }],
        });
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
