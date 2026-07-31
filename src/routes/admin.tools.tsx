import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { TOOLS } from "@/data/tools";
import { Pencil, Eye, EyeOff, RotateCcw, Search } from "lucide-react";

type ToolOverride = Database["public"]["Tables"]["tool_overrides"]["Row"];

export const Route = createFileRoute("/admin/tools")({
  component: ToolsAdmin,
});

function ToolsAdmin() {
  const [overrides, setOverrides] = useState<Record<string, ToolOverride>>({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ToolOverride>>({});
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [missingTable, setMissingTable] = useState(false);

  const load = async () => {
    setLoading(true);
    setMissingTable(false);
    try {
      const { data, error } = await supabase.from("tool_overrides").select("*");
      if (error) {
        if (error.code === "PGRST204" || error.message.includes("schema cache") || error.message.includes("relation")) {
          setMissingTable(true);
        } else {
          toast.error(error.message);
        }
      } else {
        const map: Record<string, ToolOverride> = {};
        (data ?? []).forEach((r) => (map[r.slug] = r));
        setOverrides(map);
      }
    } catch {
      setMissingTable(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [query]);

  const openEdit = (slug: string) => {
    const tool = TOOLS.find((t) => t.slug === slug);
    const o = overrides[slug];
    setEditing(slug);
    setForm({
      slug,
      title_override: o?.title_override ?? tool?.name ?? "",
      description_override: o?.description_override ?? tool?.description ?? "",
      seo_title: o?.seo_title ?? "",
      seo_description: o?.seo_description ?? "",
      featured: o?.featured ?? false,
      disabled: o?.disabled ?? false,
      sort_order: o?.sort_order ?? 0,
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const payload = {
      slug: editing,
      title_override: form.title_override || null,
      description_override: form.description_override || null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      featured: !!form.featured,
      disabled: !!form.disabled,
      sort_order: Number(form.sort_order ?? 0),
    };
    const { error } = await supabase
      .from("tool_overrides")
      .upsert(payload, { onConflict: "slug" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Tool updated");
    setEditing(null);
    load();
  };

  const toggleDisabled = async (slug: string, disabled: boolean) => {
    const tool = TOOLS.find((t) => t.slug === slug);
    const existing = overrides[slug];
    const payload = {
      slug,
      title_override: existing?.title_override ?? null,
      description_override: existing?.description_override ?? null,
      seo_title: existing?.seo_title ?? null,
      seo_description: existing?.seo_description ?? null,
      featured: existing?.featured ?? false,
      disabled,
      sort_order: existing?.sort_order ?? 0,
    };
    const { error } = await supabase
      .from("tool_overrides")
      .upsert(payload, { onConflict: "slug" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(disabled ? `Removed "${tool?.name}" from site` : `Restored "${tool?.name}"`);
    load();
  };

  const resetOverride = async (slug: string) => {
    const { error } = await supabase.from("tool_overrides").delete().eq("slug", slug);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Override reset to defaults");
    load();
  };

  const disabledCount = Object.values(overrides).filter((o) => o.disabled).length;
  const featuredCount = Object.values(overrides).filter((o) => o.featured).length;

  return (
    <div>
      <AdminPageHeader
        title="Tools"
        description={`${TOOLS.length} tools · ${featuredCount} featured · ${disabledCount} hidden. Edit any tool's title, description, SEO, or remove it from the site.`}
      />

      {missingTable && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              Database Table 'tool_overrides' Missing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The <code className="font-mono text-xs">tool_overrides</code> table does not exist in your Supabase schema cache yet. Run the SQL below in your Supabase SQL Editor to create it:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs font-mono text-foreground">
{`CREATE TABLE IF NOT EXISTS public.tool_overrides (
  slug TEXT PRIMARY KEY,
  title_override TEXT,
  description_override TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  disabled BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_overrides TO anon, authenticated, service_role;
ALTER TABLE public.tool_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tool overrides access" ON public.tool_overrides;
CREATE POLICY "Tool overrides access" ON public.tool_overrides FOR ALL USING (true) WITH CHECK (true);`}
            </pre>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.tool_overrides (
  slug TEXT PRIMARY KEY,
  title_override TEXT,
  description_override TEXT,
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  disabled BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tool_overrides TO anon, authenticated, service_role;
ALTER TABLE public.tool_overrides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tool overrides access" ON public.tool_overrides;
CREATE POLICY "Tool overrides access" ON public.tool_overrides FOR ALL USING (true) WITH CHECK (true);`);
                toast.success("SQL copied to clipboard!");
              }}
            >
              Copy Setup SQL
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search tools by name, slug, or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground">{rows.length} shown</span>
      </div>

      <div className="rounded-2xl border border-border bg-background">
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Tool</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : (
                rows.map((t) => {
                  const o = overrides[t.slug];
                  const name = o?.title_override ?? t.name;
                  const hasOverride = !!o;
                  return (
                    <tr key={t.slug} className="border-t border-border/60">
                      <td className="px-4 py-3">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">/tools/{t.slug}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{t.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {o?.featured && <Badge>Featured</Badge>}
                          {o?.disabled ? (
                            <Badge variant="destructive">Hidden</Badge>
                          ) : (
                            <Badge variant="secondary">Live</Badge>
                          )}
                          {hasOverride && !o?.disabled && !o?.featured && (
                            <Badge variant="outline">Customized</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(t.slug)}>
                            <Pencil className="mr-1 h-3.5 w-3.5" />
                            Edit
                          </Button>
                          {o?.disabled ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleDisabled(t.slug, false)}
                            >
                              <Eye className="mr-1 h-3.5 w-3.5" />
                              Restore
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setConfirmRemove(t.slug)}
                            >
                              <EyeOff className="mr-1 h-3.5 w-3.5" />
                              Remove
                            </Button>
                          )}
                          {hasOverride && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => resetOverride(t.slug)}
                              title="Reset all overrides"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Tools are defined in code. Removing hides the tool from the public site (listings, sitemap,
        search) without deleting the code. Reset clears all overrides for that tool.
      </p>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit tool</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title_override ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, title_override: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description_override ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description_override: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>SEO title</Label>
              <Input
                value={form.seo_title ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
              />
            </div>
            <div>
              <Label>SEO description</Label>
              <Textarea
                rows={3}
                value={form.seo_description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label>Featured</Label>
                <Switch
                  checked={!!form.featured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label>Hidden</Label>
                <Switch
                  checked={!!form.disabled}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, disabled: v }))}
                />
              </div>
              <div>
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirm */}
      <AlertDialog open={!!confirmRemove} onOpenChange={(o) => !o && setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this tool from the site?</AlertDialogTitle>
            <AlertDialogDescription>
              The tool will be hidden from all public pages, listings, search, and sitemap. You can
              restore it anytime from this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmRemove) toggleDisabled(confirmRemove, true);
                setConfirmRemove(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
