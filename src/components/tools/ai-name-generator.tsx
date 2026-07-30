import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratorLayout } from "@/components/layouts/tool-layouts";
import { Sparkles, Wand2, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export interface AiNameGeneratorProps {
  species: string; // e.g. "dog", "cat", "rabbit", "bird", "fish", "horse", "pet"
  vibes: string[]; // list of vibe/category keys
  seedNames: Record<string, string[]>; // vibe -> static seed pool
  perPage?: number;
}

interface NameEntry {
  name: string;
  meaning?: string | null;
}

export function AiNameGenerator({ species, vibes, seedNames, perPage = 12 }: AiNameGeneratorProps) {
  const [vibe, setVibe] = useState(vibes[0]);
  const [names, setNames] = useState<NameEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Load stored + seed names when vibe changes
  const loadStored = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, vibe, ai: false }),
      });
      const data = (await res.json()) as { names?: NameEntry[] };
      const stored = data.names ?? [];
      const seed = (seedNames[vibe] ?? []).map((n) => ({ name: n, meaning: null }));
      // merge, dedupe by lowercased name; stored (AI) first, then seed
      const seen = new Set<string>();
      const merged: NameEntry[] = [];
      for (const n of [...stored, ...seed]) {
        const key = n.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(n);
      }
      setNames(merged);
    } catch {
      setNames((seedNames[vibe] ?? []).map((n) => ({ name: n, meaning: null })));
    } finally {
      setLoading(false);
    }
  }, [species, vibe, seedNames]);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  const shuffle = () => {
    setNames((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const generateWithAi = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, vibe, ai: true, count: perPage }),
      });
      const data = (await res.json()) as { names?: NameEntry[]; added?: number; error?: string };
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Generated ${data.added ?? 0} new names — saved for everyone!`);
      }
      const stored = data.names ?? [];
      const seed = (seedNames[vibe] ?? []).map((n) => ({ name: n, meaning: null }));
      const seen = new Set<string>();
      const merged: NameEntry[] = [];
      for (const n of [...stored, ...seed]) {
        const key = n.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(n);
      }
      setNames(merged);
    } catch {
      toast.error("Could not reach the AI service.");
    } finally {
      setAiLoading(false);
    }
  };

  const copy = (name: string) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
    });
  };

  const visible = names.slice(0, Math.max(perPage, 24));

  return (
    <GeneratorLayout
      controls={
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[180px] flex-1">
            <Label>Vibe</Label>
            <Select value={vibe} onValueChange={setVibe}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {vibes.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v[0].toUpperCase() + v.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={shuffle} variant="outline" className="gap-2" disabled={loading}>
            <Sparkles className="size-4" /> Shuffle
          </Button>
          <Button onClick={generateWithAi} className="gap-2" disabled={aiLoading}>
            {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            {aiLoading ? "Generating…" : "Generate more with AI"}
          </Button>
        </div>
      }
      results={
        <>
          {loading && names.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="size-5 animate-spin mr-2" /> Loading names…
            </div>
          ) : (
            <>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((entry, i) => (
                  <li
                    key={`${entry.name}-${i}`}
                    className="group relative rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition hover:border-primary/40"
                  >
                    <button
                      onClick={() => copy(entry.name)}
                      aria-label={`Copy ${entry.name}`}
                      className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
                    >
                      {copied === entry.name ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
                    </button>
                    <div className="text-center font-display text-lg font-semibold">{entry.name}</div>
                    {entry.meaning && (
                      <div className="mt-1 text-center text-xs text-muted-foreground">{entry.meaning}</div>
                    )}
                  </li>
                ))}
              </ul>
              {names.length > 0 && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Showing {visible.length} of {names.length} names for <b>{species}</b> · vibe: <b>{vibe}</b>.
                  Every AI-generated name is saved so future visitors see it for free.
                </p>
              )}
            </>
          )}
        </>
      }
    />
  );
}
