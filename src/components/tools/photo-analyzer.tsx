import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, RefreshCw, Copy, AlertTriangle } from "lucide-react";

export interface PhotoAnalyzerProps {
  /** System prompt — expert persona for this tool. */
  system: string;
  /** User prompt — what to analyze and how to format the output. */
  prompt: string;
  /** Short UI label shown above the drop zone (e.g. "Upload a clear photo of your dog"). */
  uploadLabel?: string;
  /** Optional additional hints shown under the drop zone. */
  hint?: string;
  /** Optional CTA label on the analyze button. */
  cta?: string;
  /** Whether to show the medical disclaimer badge (default true). */
  showDisclaimer?: boolean;
  /** Tool slug for namespaced translations (defaults to the shared fallback). */
  slug?: string;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File, maxDim = 1280, quality = 0.85): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Could not read image"));
      i.src = url;
    });
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoAnalyzer({
  system,
  prompt,
  uploadLabel,
  hint,
  cta,
  showDisclaimer = true,
  slug,
}: PhotoAnalyzerProps) {
  const { t } = useTranslation("tools");
  const p = slug ?? "shared.photo-analyzer";
  const label = uploadLabel ?? t(`${p}.ui.defaultUploadLabel`);
  const hintText = hint ?? t(`${p}.ui.defaultHint`);
  const ctaText = cta ?? t(`${p}.ui.defaultCta`);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(f?: File | null) {
    setErr("");
    setResult("");
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErr(t(`${p}.ui.errNotImage`));
      return;
    }
    try {
      const compressed = await compressImage(f);
      setPreview(compressed);
    } catch {
      try {
        setPreview(await fileToDataUrl(f));
      } catch {
        setErr(t(`${p}.ui.errReadImage`));
      }
    }
  }

  async function analyze() {
    if (!preview) {
      setErr(t(`${p}.ui.errNoPhoto`));
      return;
    }
    setBusy(true);
    setErr("");
    setResult("");
    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview, prompt, system }),
      });
      const data = (await res.json()) as { content?: string; error?: string };
      if (!res.ok || !data.content) {
        setErr(data.error || t(`${p}.ui.errGeneric`));
      } else {
        setResult(data.content);
      }
    } catch {
      setErr(t(`${p}.ui.errNetwork`));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult("");
    setErr("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6">
      {showDisclaimer && (
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <strong>{t(`${p}.ui.disclaimerStrong`)}</strong> {t(`${p}.ui.disclaimerBody`)}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="mb-2 font-medium">{label}</p>
              <p className="text-sm text-muted-foreground">{hintText}</p>
            </div>

            <label
              className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-cream/40 p-6 text-center transition hover:border-primary hover:bg-cream"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0])}
              />
              {preview ? (
                <img
                  src={preview}
                  alt={t(`${p}.ui.previewAlt`)}
                  className="max-h-64 rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">{t(`${p}.ui.uploadPrompt`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`${p}.ui.dragDrop`)}</p>
                </>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              <Button onClick={analyze} disabled={!preview || busy}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t(`${p}.ui.analyzingButton`)}
                  </>
                ) : (
                  ctaText
                )}
              </Button>
              {preview && (
                <Button variant="outline" onClick={reset} disabled={busy}>
                  <RefreshCw className="mr-2 h-4 w-4" /> {t(`${p}.ui.resetButton`)}
                </Button>
              )}
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
          </CardContent>
        </Card>

        <Card className="bg-cream-deep">
          <CardContent className="p-6">
            {result ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{t(`${p}.ui.analysisTitle`)}</h3>
                  <Button variant="ghost" size="sm" onClick={copy}>
                    <Copy className="mr-2 h-4 w-4" /> {t(`${p}.ui.copyButton`)}
                  </Button>
                </div>
                <FormattedMarkdown content={result} />
              </div>
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-muted-foreground">
                <p className="max-w-xs text-sm">
                  {t(`${p}.ui.emptyBefore`)} <strong>{ctaText}</strong> {t(`${p}.ui.emptyAfter`)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
