export type AIProvider = "deepseek" | "gemini" | "openai" | "openrouter" | "lovable";

export interface AIProviderConfig {
  provider?: string; // deepseek, gemini, openai, openrouter, lovable
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
    value: "deepseek",
    label: "DeepSeek AI",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  {
    value: "gemini",
    label: "Google Gemini",
    models: ["gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
  },
  {
    value: "openai",
    label: "OpenAI (ChatGPT)",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
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
  if (clean.includes("deepseek")) return "deepseek";
  if (clean.includes("gemini") || clean.includes("google")) return "gemini";
  if (clean.includes("openai") || clean.includes("gpt")) return "openai";
  if (clean.includes("openrouter")) return "openrouter";
  return "lovable";
}

/**
 * Returns default model for provider
 */
export function getDefaultModel(provider: AIProvider, userModel?: string): string {
  if (userModel && userModel.trim()) return userModel.trim();
  switch (provider) {
    case "deepseek":
      return "deepseek-chat";
    case "gemini":
      return "gemini-2.5-flash";
    case "openai":
      return "gpt-4o-mini";
    case "openrouter":
      return "deepseek/deepseek-chat";
    case "lovable":
    default:
      return "google/gemini-3.5-flash";
  }
}

/**
 * Resolves API key for provider from options -> environment variables
 */
export function getApiKey(provider: AIProvider, customKey?: string): string | null {
  if (customKey && customKey.trim()) return customKey.trim();

  switch (provider) {
    case "deepseek":
      return process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || null;
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
  const provider = normalizeProvider(options.provider || process.env.DEFAULT_AI_PROVIDER);
  const apiKey = getApiKey(provider, options.apiKey);
  const model = getDefaultModel(provider, options.model);

  if (!apiKey) {
    const providerNames: Record<AIProvider, string> = {
      deepseek: "DeepSeek (DEEPSEEK_API_KEY)",
      gemini: "Gemini (GEMINI_API_KEY)",
      openai: "OpenAI (OPENAI_API_KEY)",
      openrouter: "OpenRouter (OPENROUTER_API_KEY)",
      lovable: "Lovable Gateway (LOVABLE_API_KEY)",
    };
    return {
      status: 400,
      content: "",
      error: `API Key missing for ${providerNames[provider] || provider}. Set key in environment variable (e.g. DEEPSEEK_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY) or in settings.`,
    };
  }

  const temperature = options.temperature ?? 0.7;
  const bodyPayload: Record<string, unknown> = {
    model,
    messages: options.messages,
    temperature,
  };

  if (options.response_format) {
    bodyPayload.response_format = options.response_format;
  }

  let endpoint = "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  switch (provider) {
    case "deepseek":
      endpoint = process.env.DEEPSEEK_BASE_URL
        ? `${process.env.DEEPSEEK_BASE_URL.replace(/\/$/, "")}/chat/completions`
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
        return { status: 429, content: "", error: `${provider.toUpperCase()} rate limit reached. Please wait a moment.` };
      }
      if (response.status === 401 || response.status === 403) {
        return { status: 401, content: "", error: `Invalid ${provider.toUpperCase()} API key.` };
      }
      const errText = await response.text().catch(() => "");
      return {
        status: response.status,
        content: "",
        error: `${provider.toUpperCase()} error (${response.status}): ${errText.slice(0, 200)}`,
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!content) {
      return { status: 502, content: "", error: `${provider.toUpperCase()} returned an empty response.` };
    }

    return { status: 200, content };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 502, content: "", error: `Could not connect to ${provider.toUpperCase()}: ${message}` };
  }
}
