import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
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
  uploadLabel = "Upload a clear, well-lit photo",
  hint = "JPG, PNG or WebP. Best results with a bright, close-up image on a neutral background.",
  cta = "Analyze photo",
  showDisclaimer = true,
}: PhotoAnalyzerProps) {
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
      setErr("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    try {
      const compressed = await compressImage(f);
      setPreview(compressed);
    } catch {
      try {
        setPreview(await fileToDataUrl(f));
      } catch {
        setErr("Could not read that image. Try a different file.");
      }
    }
  }

  async function analyze() {
    if (!preview) {
      setErr("Please upload a photo first.");
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
        setErr(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data.content);
      }
    } catch {
      setErr("Network error. Please try again.");
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
            <strong>Educational only.</strong> AI photo analysis is not a diagnosis. For any medical
            or behavioural concern, please consult a licensed veterinarian.
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="mb-2 font-medium">{uploadLabel}</p>
              <p className="text-sm text-muted-foreground">{hint}</p>
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
                  alt="Selected preview"
                  className="max-h-64 rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Click to upload a photo</p>
                  <p className="text-xs text-muted-foreground">or drag &amp; drop</p>
                </>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              <Button onClick={analyze} disabled={!preview || busy}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  cta
                )}
              </Button>
              {preview && (
                <Button variant="outline" onClick={reset} disabled={busy}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset
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
                  <h3 className="font-display text-lg font-semibold">AI Analysis</h3>
                  <Button variant="ghost" size="sm" onClick={copy}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-semibold">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center text-muted-foreground">
                <p className="max-w-xs text-sm">
                  Upload a photo and click <strong>{cta}</strong> to receive an educational, expert
                  breakdown in seconds.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
