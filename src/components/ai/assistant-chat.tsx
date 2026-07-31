import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  Key,
  Loader2,
  RotateCcw,
  Send,
  Settings2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getActiveUser } from "@/lib/custom-google-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiAssistant } from "@/data/ai-assistants";
import { PROVIDER_OPTIONS, type AIProvider } from "@/lib/ai-provider";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
}

function storageKey(slug: string) {
  return `furtools:ai:${slug}:history:v1`;
}

const SETTINGS_KEY = "furtools:ai:provider_settings:v1";

export function AssistantChat({ assistant }: { assistant: AiAssistant }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // AI Provider state
  const [provider, setProvider] = useState<AIProvider>("lovable");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  useEffect(() => {
    async function checkAdmin() {
      const u = await getActiveUser();
      if (u?.email.toLowerCase() === "gplboy2068@gmail.com") {
        setIsAdminUser(true);
      }
    }
    checkAdmin();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved provider settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.provider) setProvider(parsed.provider);
        if (parsed.model) setModel(parsed.model);
        if (parsed.apiKey) setApiKey(parsed.apiKey);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Save provider settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ provider, model, apiKey })
      );
    } catch {
      /* ignore */
    }
  }, [provider, model, apiKey]);

  // Load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(assistant.slug));
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    textareaRef.current?.focus();
  }, [assistant.slug]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(assistant.slug), JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore */
    }
  }, [assistant.slug, messages]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      at: Date.now(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistant: assistant.slug,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          provider,
          model: model || undefined,
          apiKey: apiKey.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { content?: string; error?: string };
      if (!res.ok || !data.content) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setMessages((cur) => [
          ...cur,
          { id: crypto.randomUUID(), role: "assistant", content: data.content!, at: Date.now() },
        ]);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 30);
    }
  }

  function reset() {
    if (messages.length && !confirm("Clear this conversation?")) return;
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(storageKey(assistant.slug));
    } catch {
      /* ignore */
    }
    textareaRef.current?.focus();
  }

  async function copyMsg(msg: Msg) {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* ignore */
    }
  }

  function exportChat() {
    const lines = messages.map((m) => {
      const who = m.role === "user" ? "You" : assistant.name;
      const time = new Date(m.at).toLocaleString();
      return `## ${who} — ${time}\n\n${m.content}\n`;
    });
    const md = `# ${assistant.name} — Conversation\n\nExported ${new Date().toLocaleString()}\n\n${lines.join("\n")}\n\n---\n${assistant.showMedicalDisclaimer ? "This tool is for educational purposes only and does not replace professional veterinary advice." : ""}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assistant.slug}-chat-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const selectedProviderObj = PROVIDER_OPTIONS.find((p) => p.value === provider) || PROVIDER_OPTIONS[0];

  const Icon = assistant.icon;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-3xl border border-border bg-card shadow-sm">
        {/* Top Control Bar: Provider & Model Selector (Visible to Admin only) */}
        {isAdminUser && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                  <Settings2 className="size-3.5" /> AI Engine:
                </span>
                <Select
                  value={provider}
                  onValueChange={(val) => {
                    const p = val as AIProvider;
                    setProvider(p);
                    setModel("");
                  }}
                >
                  <SelectTrigger className="h-8 w-[160px] text-xs">
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProviderObj.models.length > 0 && (
                  <Select
                    value={model || selectedProviderObj.models[0]}
                    onValueChange={(val) => setModel(val)}
                  >
                    <SelectTrigger className="h-8 w-[170px] text-xs">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProviderObj.models.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setShowKeyInput((v) => !v)}
              >
                <Key className="size-3.5" />
                {apiKey ? "API Key Set ✓" : "Custom API Key"}
              </Button>
            </div>

            {/* Custom API Key Collapsible Input */}
            {showKeyInput && (
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-5 py-2.5">
                <Key className="size-4 shrink-0 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder={`Enter custom ${selectedProviderObj.label} API Key (optional)`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
                {apiKey && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setApiKey("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-3 border-b border-border bg-amber-50 px-5 py-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <strong>Educational only.</strong> This tool is for educational purposes only and does
            not replace professional veterinary advice. In an emergency, contact your veterinarian
            immediately.
          </p>
        </div>

        {/* Transcript */}
        <div
          ref={scrollRef}
          className="h-[520px] overflow-y-auto px-4 py-6 sm:px-6"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <EmptyState assistant={assistant} onPick={send} />
          ) : (
            <ul className="space-y-6">
              {messages.map((m) => (
                <li key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  {m.role === "assistant" ? (
                    <div className="group relative max-w-[85%]">
                      <div className="flex items-center gap-2 pb-1 text-xs font-medium text-muted-foreground">
                        <Icon className="size-3.5" aria-hidden />
                        {assistant.name}
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 text-foreground">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      <div className="mt-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => copyMsg(m)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
                        >
                          {copiedId === m.id ? <Check className="size-3" /> : <Copy className="size-3" />}
                          {copiedId === m.id ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                    </div>
                  )}
                </li>
              ))}
              {loading && (
                <li className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="flex items-center gap-2 pb-1 text-xs font-medium text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden />
                      {assistant.name}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Thinking…
                    </div>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        {error && (
          <div className="border-t border-border bg-destructive/10 px-5 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Composer */}
        <div className="border-t border-border p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Ask ${assistant.name} a question…`}
              className="min-h-[54px] resize-none rounded-2xl bg-background"
              disabled={loading}
            />
            <Button
              type="button"
              size="icon"
              className="size-11 shrink-0 rounded-full"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-muted-foreground">
            <span>Press Enter to send · Shift + Enter for new line</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-accent"
                disabled={messages.length === 0}
              >
                <RotateCcw className="size-3" /> Reset
              </button>
              <button
                type="button"
                onClick={exportChat}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-accent"
                disabled={messages.length === 0}
              >
                <Download className="size-3" /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: suggested prompts */}
      <aside className="rounded-3xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Sparkles className="size-4 text-primary" /> Try asking
        </h2>
        <ul className="mt-3 space-y-2">
          {assistant.suggestedPrompts.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => send(p)}
                disabled={loading}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-sm leading-snug transition hover:border-primary/50 hover:bg-accent disabled:opacity-60"
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">
          Your conversation history is saved on this device.
        </p>
      </aside>
    </div>
  );
}

function EmptyState({
  assistant,
  onPick,
}: {
  assistant: AiAssistant;
  onPick: (text: string) => void;
}) {
  const Icon = assistant.icon;
  return (
    <div className="mx-auto max-w-lg py-8 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-7" />
      </div>
      <h2 className="mt-4 font-display text-2xl font-semibold">{assistant.name}</h2>
      <p className="mt-2 text-muted-foreground">{assistant.description}</p>
      <div className="mt-6 grid gap-2 text-left">
        {assistant.suggestedPrompts.slice(0, 3).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-primary/50 hover:bg-accent"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
