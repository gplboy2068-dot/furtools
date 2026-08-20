import { supabase } from "@/integrations/supabase/client";

export type AIProvider = "deepseek" | "gemini" | "openai" | "anthropic" | "openrouter" | "lovable";

export interface AIProviderConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<Record<string, unknown>>;
}

export interface AIRequestOptions {
  provider?: string;
  apiKey?: string;
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  response_format?: { type: "json_object" | "text" };
}

export interface AIResponse {
  content: string;
  error?: string;
  status: number;
}

export const PROVIDER_OPTIONS: Array<{ value: AIProvider; label: string; models: string[] }> = [
  {
    value: "gemini",
    label: "Google Gemini",
    models: ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
  },
  {
    value: "openai",
    label: "OpenAI (ChatGPT)",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
  },
  {
    value: "anthropic",
    label: "Anthropic (Claude)",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
  },
  {
    value: "deepseek",
    label: "DeepSeek AI",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  {
    value: "openrouter",
    label: "OpenRouter (Multi-Model)",
    models: ["deepseek/deepseek-chat", "google/gemini-2.5-flash", "openai/gpt-4o-mini", "anthropic/claude-3.5-sonnet"],
  },
  {
    value: "lovable",
    label: "Lovable Gateway",
    models: ["google/gemini-3.5-flash"],
  },
];

/**
 * Normalizes provider name
 */
export function normalizeProvider(p?: string): AIProvider {
  const clean = (p || "").toLowerCase().trim();
  if (clean.includes("gemini") || clean.includes("google")) return "gemini";
  if (clean.includes("openai") || clean.includes("gpt") || clean.includes("chatgpt")) return "openai";
  if (clean.includes("anthropic") || clean.includes("claude")) return "anthropic";
  if (clean.includes("deepseek")) return "deepseek";
  if (clean.includes("openrouter")) return "openrouter";
  if (clean.includes("lovable")) return "lovable";
  return "gemini";
}

/**
 * Returns default model for provider
 */
export function getDefaultModel(provider: AIProvider, userModel?: string): string {
  if (userModel && userModel.trim()) return userModel.trim();
  switch (provider) {
    case "gemini":
      return "gemini-2.5-flash";
    case "openai":
      return "gpt-4o-mini";
    case "anthropic":
      return "claude-3-5-haiku-20241022";
    case "deepseek":
      return "deepseek-chat";
    case "openrouter":
      return "google/gemini-2.5-flash";
    case "lovable":
    default:
      return "google/gemini-3.5-flash";
  }
}

/**
 * Resolves API key for provider from environment variables
 */
export function getApiKey(provider: AIProvider, customKey?: string): string | null {
  if (customKey && customKey.trim()) return customKey.trim();

  switch (provider) {
    case "gemini":
      return (
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.VITE_GEMINI_API_KEY ||
        null
      );
    case "openai":
      return process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || null;
    case "anthropic":
      return (
        process.env.ANTHROPIC_API_KEY ||
        process.env.CLAUDE_API_KEY ||
        process.env.VITE_ANTHROPIC_API_KEY ||
        null
      );
    case "deepseek":
      return process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || null;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY || null;
    case "lovable":
    default:
      return process.env.LOVABLE_API_KEY || process.env.VITE_LOVABLE_API_KEY || null;
  }
}

/**
 * Main function to execute AI chat completions across multiple providers
 */
export async function executeAICompletion(options: AIRequestOptions): Promise<AIResponse> {
  // 1. Fetch AI settings from database (site_settings table)
  let dbSettings: Record<string, string> = {};
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .like("key", "ai.%");
    if (data) {
      for (const row of data) {
        if (row && row.key) {
          const rawVal =
            typeof row.value === "string"
              ? row.value.trim()
              : row.value != null
              ? String(row.value).trim()
              : "";
          const cleaned = rawVal.replace(/^["']|["']$/g, "").trim();
          if (cleaned) {
            dbSettings[row.key] = cleaned;
          }
        }
      }
    }
  } catch {
    /* ignore database error */
  }

  // Determine target provider from options -> DB settings -> environment variable -> gemini fallback
  const dbDefaultProvider = dbSettings["ai.default_provider"];
  const initialProvider = normalizeProvider(
    options.provider || dbDefaultProvider || process.env.DEFAULT_AI_PROVIDER || "gemini"
  );

  const resolveKeyForProvider = (p: AIProvider): string | null => {
    if (options.apiKey && options.apiKey.trim()) return options.apiKey.trim();

    const dbKeyMap: Record<AIProvider, string | undefined> = {
      gemini: dbSettings["ai.gemini_key"],
      openai: dbSettings["ai.openai_key"],
      anthropic: dbSettings["ai.anthropic_key"],
      deepseek: dbSettings["ai.deepseek_key"],
      openrouter: dbSettings["ai.openrouter_key"],
      lovable: dbSettings["ai.lovable_key"],
    };
    if (dbKeyMap[p] && dbKeyMap[p]?.trim()) return dbKeyMap[p]!.trim();

    return getApiKey(p);
  };

  let targetProvider = initialProvider;
  let apiKey = resolveKeyForProvider(targetProvider);

  // Auto-fallback: If target provider key is missing, look for any available key across providers!
  if (!apiKey) {
    const fallbackProviders: AIProvider[] = ["gemini", "openai", "anthropic", "deepseek", "openrouter", "lovable"];
    for (const altProv of fallbackProviders) {
      const altKey = resolveKeyForProvider(altProv);
      if (altKey) {
        targetProvider = altProv;
        apiKey = altKey;
        break;
      }
    }
  }

  const dbDefaultModel = dbSettings["ai.default_model"];
  const model = getDefaultModel(targetProvider, options.model || (options.provider === targetProvider ? dbDefaultModel : undefined));

  if (!apiKey) {
    return {
      status: 400,
      content: "",
      error: `AI is not configured. Please enter your API key (Gemini, OpenAI, Anthropic, DeepSeek, or OpenRouter) in the Admin Panel (Settings -> AI) or set it in your environment variables (e.g. GEMINI_API_KEY).`,
    };
  }

  const temperature = options.temperature ?? 0.7;
  let endpoint = "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  let bodyPayload: Record<string, unknown> = {
    model,
    messages: options.messages,
    temperature,
  };

  if (options.response_format) {
    bodyPayload.response_format = options.response_format;
  }

  switch (targetProvider) {
    case "anthropic": {
      endpoint = "https://api.anthropic.com/v1/messages";
      headers["x-api-key"] = apiKey;
      headers["anthropic-version"] = "2023-06-01";

      const systemMessages = options.messages.filter((m) => m.role === "system");
      const systemStr = systemMessages
        .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)))
        .join("\n\n");

      const anthropicMessages = options.messages
        .filter((m) => m.role !== "system")
        .map((m) => {
          if (typeof m.content === "string") {
            return { role: m.role as "user" | "assistant", content: m.content };
          }
          const parts = (Array.isArray(m.content) ? m.content : []).map((part: Record<string, unknown>) => {
            const partObj = part as { type?: string; image_url?: { url?: string }; text?: string };
            if (partObj.type === "image_url" && partObj.image_url?.url?.startsWith("data:")) {
              const matches = partObj.image_url.url.match(/^data:([^;]+);base64,(.+)$/);
              if (matches) {
                return {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: matches[1],
                    data: matches[2],
                  },
                };
              }
            }
            if (partObj.type === "text" || typeof partObj.text === "string") {
              return { type: "text", text: partObj.text || "" };
            }
            return { type: "text", text: JSON.stringify(part) };
          });
          return { role: m.role as "user" | "assistant", content: parts };
        });

      bodyPayload = {
        model,
        max_tokens: 4096,
        messages: anthropicMessages,
        temperature,
        ...(systemStr ? { system: systemStr } : {}),
      };
      break;
    }

    case "deepseek":
      endpoint =
        dbSettings["ai.deepseek_base_url"] || process.env.DEEPSEEK_BASE_URL
          ? `${(dbSettings["ai.deepseek_base_url"] || process.env.DEEPSEEK_BASE_URL)!.replace(/\/$/, "")}/chat/completions`
          : "https://api.deepseek.com/chat/completions";
      headers["Authorization"] = `Bearer ${apiKey}`;
      break;

    case "gemini":
      endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      headers["Authorization"] = `Bearer ${apiKey}`;
      break;

    case "openai":
      endpoint = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${apiKey}`;
      break;

    case "openrouter":
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      headers["Authorization"] = `Bearer ${apiKey}`;
      headers["HTTP-Referer"] = "https://furtools.com";
      headers["X-Title"] = "FurTools";
      break;

    case "lovable":
    default:
      endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
      headers["Lovable-API-Key"] = apiKey;
      break;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return {
          status: 429,
          content: "",
          error: `${targetProvider.toUpperCase()} rate limit reached. Please wait a moment.`,
        };
      }
      if (response.status === 401 || response.status === 403) {
        return {
          status: 401,
          content: "",
          error: `Invalid ${targetProvider.toUpperCase()} API key. Please check your key in Admin Settings.`,
        };
      }
      const errText = await response.text().catch(() => "");
      return {
        status: response.status,
        content: "",
        error: `${targetProvider.toUpperCase()} error (${response.status}): ${errText.slice(0, 200)}`,
      };
    }

    if (targetProvider === "anthropic") {
      const data = (await response.json()) as {
        content?: Array<{ type?: string; text?: string }>;
      };
      const text = data.content?.find((c) => c.type === "text" || c.text)?.text?.trim() ?? "";
      if (!text) {
        return { status: 502, content: "", error: "Anthropic returned an empty response." };
      }
      return { status: 200, content: text };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!content) {
      return {
        status: 502,
        content: "",
        error: `${targetProvider.toUpperCase()} returned an empty response.`,
      };
    }

    return { status: 200, content };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      status: 502,
      content: "",
      error: `Could not connect to ${targetProvider.toUpperCase()}: ${message}`,
    };
  }
}
