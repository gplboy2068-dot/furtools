import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Code2, Copy, Check, ExternalLink, Sparkles, MonitorSmartphone } from "lucide-react";

interface EmbedDialogProps {
  slug: string;
  title: string;
}

export function EmbedCalculatorDialog({ slug, title }: EmbedDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("650");
  const [includeAttribution, setIncludeAttribution] = useState(true);
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://furtools.com/embed/tools/${slug}`;

  const iframeSnippet = useMemo(() => {
    const frame = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border:1px solid #e2e8f0;border-radius:16px;max-width:100%;width:${width};" title="${title} — FurTools" loading="lazy"></iframe>`;

    if (includeAttribution) {
      const backlink = `\n<div style="font-size:12px;text-align:center;margin-top:6px;color:#64748b;font-family:system-ui,sans-serif;">Free Pet Calculator by <a href="https://furtools.com" target="_blank" rel="noopener" style="color:#2563eb;font-weight:600;text-decoration:none;">FurTools.com</a></div>`;
      return `${frame}${backlink}`;
    }

    return frame;
  }, [embedUrl, width, height, title, includeAttribution]);

  function copyToClipboard() {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    toast.success("Embed iframe code copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 transition-colors shadow-xs"
        >
          <Code2 className="size-3.5" /> &lt;/&gt; Embed on Your Site
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit mb-1">
            <Sparkles className="size-3.5" /> Free Publisher Widget
          </div>
          <DialogTitle className="font-display text-xl font-bold">
            Embed &ldquo;{title}&rdquo; on Your Website or Blog
          </DialogTitle>
          <DialogDescription className="text-xs">
            Add this interactive calculator to your WordPress, Webflow, Shopify, or custom HTML site in seconds. It is 100% free, responsive, and mobile-friendly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Customization Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
            <div>
              <Label htmlFor="width" className="text-xs font-semibold">Width</Label>
              <Input
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="100% or 600px"
                className="mt-1 h-8 text-xs bg-background"
              />
            </div>

            <div>
              <Label htmlFor="height" className="text-xs font-semibold">Height (px)</Label>
              <Input
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="650"
                className="mt-1 h-8 text-xs bg-background"
              />
            </div>

            <div className="flex flex-col justify-between pt-1 sm:pt-0">
              <Label className="text-xs font-semibold">Include Attribution</Label>
              <div className="flex items-center gap-2 mt-1">
                <Switch
                  checked={includeAttribution}
                  onCheckedChange={setIncludeAttribution}
                />
                <span className="text-[11px] text-muted-foreground font-medium">Powered by badge</span>
              </div>
            </div>
          </div>

          {/* HTML Code Output Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">HTML Embed Snippet:</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-7 text-xs gap-1.5 text-primary hover:text-primary"
              >
                {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>

            <div className="relative rounded-xl bg-slate-950 p-3 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 selection:bg-primary selection:text-white">
              <pre className="whitespace-pre-wrap break-all">{iframeSnippet}</pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MonitorSmartphone className="size-4 text-primary shrink-0" />
              <span>Works automatically on desktop and mobile browsers.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl text-xs gap-1 font-semibold"
              >
                <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                  <span>Test URL</span>
                  <ExternalLink className="size-3" />
                </a>
              </Button>

              <Button
                type="button"
                onClick={copyToClipboard}
                size="sm"
                className="rounded-xl text-xs font-bold gap-1.5 shadow-xs w-full sm:w-auto"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied to Clipboard!" : "Copy Iframe Code"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
