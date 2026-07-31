import { createFileRoute } from "@tanstack/react-router";
import { executeAICompletion } from "@/lib/ai-provider";
import { GlossaryManager, validateTranslation } from "@/lib/tms-engine";

interface TranslationItem {
  key: string;
  sourceText: string;
}

interface RequestBody {
  items: TranslationItem[];
  targetLang: string;
  targetLangName: string;
  provider?: string;
  model?: string;
  apiKey?: string;
}

export const Route = createFileRoute("/api/ai-translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: RequestBody;
        try {
          body = (await request.json()) as RequestBody;
        } catch {
          return json({ error: "Invalid JSON body." }, 400);
        }

        const { items, targetLang, targetLangName, provider, model, apiKey } = body;

        if (!Array.isArray(items) || items.length === 0) {
          return json({ error: "No items provided for translation." }, 400);
        }

        if (!targetLang || !targetLangName) {
          return json({ error: "Target language is required." }, 400);
        }

        const glossaryPrompt = GlossaryManager.getPromptRule();

        const systemPrompt = `You are a Senior Internationalization AI Translator and Localization Expert.
Your task is to translate JSON text strings from English into ${targetLangName} (${targetLang}).

STRICT TRANSLATION RULES:
1. Translate naturally and idiomatically while preserving exact intent.
2. ${glossaryPrompt}
3. DO NOT translate HTML tags (e.g. <span>, <div>, <b>). Preserve HTML intact.
4. DO NOT translate Markdown formatting (e.g. **, _, #, []()).
5. DO NOT translate variable placeholders like {{count}}, {{entity}}, {name}, or {0}. Keep them identical.
6. DO NOT translate URLs, code snippets, or email addresses.
7. Return ONLY a valid JSON object mapping each input item key to its translated string.

Format your output as valid JSON:
{
  "key1": "translated text 1",
  "key2": "translated text 2"
}`;

        const inputPayload = items.reduce<Record<string, string>>((acc, item) => {
          acc[item.key] = item.sourceText;
          return acc;
        }, {});

        const userPrompt = `Translate the following JSON object into ${targetLangName} (${targetLang}):\n${JSON.stringify(inputPayload, null, 2)}`;

        const result = await executeAICompletion({
          provider,
          model,
          apiKey,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        if (result.error) {
          return json({ error: result.error }, result.status);
        }

        let parsedTranslations: Record<string, string> = {};
        try {
          // Clean JSON markdown blocks if present
          let cleanContent = result.content.trim();
          if (cleanContent.startsWith("```json")) {
            cleanContent = cleanContent.replace(/^```json/, "").replace(/```$/, "").trim();
          } else if (cleanContent.startsWith("```")) {
            cleanContent = cleanContent.replace(/^```/, "").replace(/```$/, "").trim();
          }
          parsedTranslations = JSON.parse(cleanContent);
        } catch {
          return json({ error: "Failed to parse AI translation JSON output.", raw: result.content }, 500);
        }

        // Validate each translated item and compute tokens/cost estimates
        const validatedResults = items.map((item) => {
          const translatedText = parsedTranslations[item.key] || item.sourceText;
          const qa = validateTranslation(item.sourceText, translatedText);
          return {
            key: item.key,
            sourceText: item.sourceText,
            translatedText,
            isValid: qa.isValid,
            warnings: qa.warnings,
          };
        });

        const totalChars = items.reduce((sum, item) => sum + item.sourceText.length, 0);
        const estimatedTokens = Math.ceil(totalChars / 4) + Math.ceil(result.content.length / 4);
        const estimatedCost = (estimatedTokens / 1000) * 0.0005; // ~$0.0005 per 1k tokens

        return json({
          success: true,
          targetLang,
          translations: validatedResults,
          tokens: estimatedTokens,
          cost: Math.round(estimatedCost * 100000) / 100000,
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
