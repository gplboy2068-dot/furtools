import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSpeciesConfig, type SpeciesField } from "@/data/species-config";
import { Sparkles, Save } from "lucide-react";

export function SpeciesSpecificsTab({
  petId, species, initial,
}: { petId: string; species: string; initial: Record<string, unknown> }) {
  const cfg = getSpeciesConfig(species);
  const [data, setData] = useState<Record<string, unknown>>(initial ?? {});
  const [busy, setBusy] = useState(false);

  useEffect(() => setData(initial ?? {}), [initial, petId]);

  if (!cfg) {
    return <p className="text-sm text-muted-foreground">No species-specific fields configured.</p>;
  }

  const set = (k: string, v: unknown) => setData((s) => ({ ...s, [k]: v }));

  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("pets")
        .update({ species_data: data as never })
        .eq("id", petId);
      if (error) throw error;
      toast.success(`${cfg!.singular} details saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">{cfg.singular} details</h3>
            <p className="text-sm text-muted-foreground">
              Species-specific info for {cfg.plural.toLowerCase()}. Reuses the shared health,
              expenses, reminders, and AI systems.
            </p>
          </div>
          <a
            href={`/ai/${cfg.aiSlug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
          >
            <Sparkles className="size-3.5" /> {cfg.aiName}
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {cfg.fields.map((f) => (
            <FieldControl key={f.key} field={f} value={data[f.key]} onChange={(v) => set(f.key, v)} />
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={busy} className="rounded-full">
            <Save className="mr-1 size-4" /> {busy ? "Saving…" : "Save details"}
          </Button>
        </div>
      </div>

      {cfg.extraTabs && cfg.extraTabs.length > 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
          <h4 className="font-medium">Coming soon for {cfg.plural.toLowerCase()}</h4>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {cfg.extraTabs.map((t) => (
              <li key={t} className="rounded-full bg-background px-2.5 py-1">{t}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Use the Journal, Documents, and Expenses tabs to track these today — dedicated logs are on the roadmap.
          </p>
        </div>
      )}

      <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        Educational information only, not a substitute for professional veterinary advice.
      </p>
    </div>
  );
}

function FieldControl({
  field, value, onChange,
}: { field: SpeciesField; value: unknown; onChange: (v: unknown) => void }) {
  const label = field.unit ? `${field.label} (${field.unit})` : field.label;
  if (field.type === "textarea") {
    return (
      <div className="sm:col-span-2">
        <Label>{label}</Label>
        <Textarea rows={3} className="mt-1.5" value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div>
        <Label>{label}</Label>
        <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {(field.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
  }
  return (
    <div>
      <Label>{label}</Label>
      <Input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        className="mt-1.5" value={value == null ? "" : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(field.type === "number" ? (v === "" ? null : Number(v)) : v);
        }} placeholder={field.placeholder} />
    </div>
  );
}
