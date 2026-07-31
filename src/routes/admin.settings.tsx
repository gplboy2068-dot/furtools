import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, RotateCcw, Save, Eye, EyeOff, AlertTriangle, Copy, Check, RefreshCw, Database } from "lucide-react";
import {
  SETTINGS_SECTIONS,
  getDefaults,
  type SettingField,
  type SettingSection,
} from "@/lib/settings-schema";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SettingsPage,
});

type Values = Record<string, unknown>;

function toTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim()) return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

function validate(field: SettingField, value: unknown): string | null {
  if (value === "" || value === null || value === undefined) return null;
  if (field.type === "email" && typeof value === "string") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
  }
  if (field.type === "url" && typeof value === "string") {
    try {
      new URL(value);
    } catch {
      return "Enter a valid URL (https://…)";
    }
  }
  if (field.type === "number") {
    const n = Number(value);
    if (Number.isNaN(n)) return "Must be a number";
    if (field.min !== undefined && n < field.min) return `Min ${field.min}`;
    if (field.max !== undefined && n > field.max) return `Max ${field.max}`;
  }
  if (field.type === "json" && typeof value === "string") {
    try {
      JSON.parse(value);
    } catch {
      return "Invalid JSON";
    }
  }
  return null;
}

function SettingInput({
  field,
  value,
  onChange,
  error,
}: {
  field: SettingField;
  value: unknown;
  onChange: (v: unknown) => void;
  error: string | null;
}) {
  const [showSecret, setShowSecret] = useState(false);

  const common = "w-full";
  const strVal = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value, null, 2);

  switch (field.type) {
    case "boolean":
      return (
        <div className="flex items-center gap-3">
          <Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} />
          <span className="text-sm text-muted-foreground">{value ? "Enabled" : "Disabled"}</span>
        </div>
      );
    case "textarea":
      return (
        <Textarea
          className={common}
          rows={field.rows ?? 4}
          value={typeof value === "string" ? value : ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <Select value={typeof value === "string" ? value : ""} onValueChange={(v) => onChange(v)}>
          <SelectTrigger className={common}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "number":
      return (
        <Input
          type="number"
          className={common}
          value={value == null ? "" : String(value)}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        />
      );
    case "password":
      return (
        <div className="relative">
          <Input
            type={showSecret ? "text" : "password"}
            className={common}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder ?? (field.secret ? "••••••••" : "")}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
            onClick={() => setShowSecret((s) => !s)}
            aria-label={showSecret ? "Hide" : "Show"}
          >
            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      );
    case "tags":
      return (
        <Input
          className={common}
          value={toTags(value).join(", ")}
          placeholder="value1, value2, value3"
          onChange={(e) => onChange(e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
        />
      );
    case "json":
      return (
        <Textarea
          className={`${common} font-mono text-xs`}
          rows={field.rows ?? 6}
          value={strVal}
          placeholder='{"key": "value"}'
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "color":
      return (
        <Input
          type="color"
          className="h-10 w-20 p-1"
          value={typeof value === "string" && value ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <Input
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          className={common}
          value={typeof value === "string" ? value : value == null ? "" : String(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function SectionForm({
  section,
  values,
  initialValues,
  onChange,
  onSave,
  onReset,
  saving,
}: {
  section: SettingSection;
  values: Values;
  initialValues: Values;
  onChange: (key: string, v: unknown) => void;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
}) {
  const errors = useMemo(() => {
    const e: Record<string, string | null> = {};
    for (const f of section.fields) e[f.key] = validate(f, values[f.key]);
    return e;
  }, [section, values]);

  const hasErrors = Object.values(errors).some(Boolean);
  const dirty = section.fields.some(
    (f) => JSON.stringify(values[f.key] ?? null) !== JSON.stringify(initialValues[f.key] ?? null),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="font-display text-xl">{section.label}</CardTitle>
            {section.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onReset} disabled={saving || !dirty}>
              <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
            </Button>
            <Button type="button" size="sm" onClick={onSave} disabled={saving || hasErrors || !dirty}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {section.fields.map((f) => {
            const isWide =
              f.type === "textarea" || f.type === "json" || f.type === "tags" || f.rows;
            return (
              <div key={f.key} className={isWide ? "md:col-span-2" : ""}>
                <Label htmlFor={f.key} className="text-sm font-medium">
                  {f.label}
                  {f.secret ? (
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                      secret
                    </span>
                  ) : null}
                </Label>
                <div className="mt-1.5">
                  <SettingInput
                    field={f}
                    value={values[f.key]}
                    onChange={(v) => onChange(f.key, v)}
                    error={errors[f.key]}
                  />
                </div>
                {f.help ? <p className="mt-1 text-xs text-muted-foreground">{f.help}</p> : null}
                {errors[f.key] ? (
                  <p className="mt-1 text-xs text-destructive">{errors[f.key]}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const SETUP_SQL = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general',
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO anon, authenticated, service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Site settings access" ON public.site_settings;
DROP POLICY IF EXISTS "Allow all site_settings" ON public.site_settings;

CREATE POLICY "Allow all site_settings" ON public.site_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

NOTIFY pgrst, 'reload schema';`;

function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [rlsError, setRlsError] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [values, setValues] = useState<Values>(() => getDefaults());
  const [initialValues, setInitialValues] = useState<Values>(() => getDefaults());

  async function loadSettings() {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) {
      const isMissing =
        error.message?.includes("site_settings") ||
        error.message?.includes("schema cache") ||
        error.code === "PGRST204" ||
        error.code === "42P01";
      if (isMissing) {
        setTableMissing(true);
      } else {
        toast.error(`Failed to load settings: ${error.message}`);
      }
      setLoading(false);
      return;
    }
    setTableMissing(false);
    setRlsError(false);
    const base = getDefaults();
    for (const row of data ?? []) {
      base[row.key] = (row as { value: unknown }).value;
    }
    setValues(base);
    setInitialValues(JSON.parse(JSON.stringify(base)));
    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleCopySql() {
    navigator.clipboard.writeText(SETUP_SQL);
    setCopiedSql(true);
    toast.success("SQL script copied to clipboard!");
    setTimeout(() => setCopiedSql(false), 2500);
  }

  function updateValue(key: string, v: unknown) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function saveSection(section: SettingSection) {
    if (tableMissing) {
      toast.error("Cannot save settings because table 'public.site_settings' is missing.", {
        description: "Please run the provided SQL script in your Supabase SQL Editor first.",
      });
      return;
    }
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const rows: Array<{ key: string; value: unknown; category: string; updated_by?: string | null }> = [];
      for (const f of section.fields) {
        const current = values[f.key];
        const initial = initialValues[f.key];
        if (JSON.stringify(current ?? null) === JSON.stringify(initial ?? null)) continue;
        let value: unknown = current;
        if (f.type === "json" && typeof current === "string") {
          try {
            value = current.trim() ? JSON.parse(current) : null;
          } catch {
            toast.error(`Invalid JSON in ${f.label}`);
            setSaving(false);
            return;
          }
        }
        rows.push({
          key: f.key,
          value,
          category: section.id,
          updated_by: auth.user?.id ?? null,
        });
      }
      if (rows.length === 0) {
        toast.info("No changes to save");
        setSaving(false);
        return;
      }
      const { error } = await supabase
        .from("site_settings")
        .upsert(rows as never, { onConflict: "key" });
      if (error) throw error;
      setRlsError(false);
      const next = { ...initialValues };
      for (const r of rows) next[r.key] = r.value;
      setInitialValues(next);
      toast.success(`Saved ${rows.length} setting${rows.length === 1 ? "" : "s"} in ${section.label}`);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "message" in e
          ? String((e as { message?: string }).message)
          : String(e);

      if (msg.toLowerCase().includes("row-level security") || msg.toLowerCase().includes("policy")) {
        setRlsError(true);
        toast.error("Save failed: Row Level Security (RLS) policy restriction.", {
          description: "Run the provided SQL script in your Supabase SQL Editor to grant write access.",
        });
      } else {
        toast.error(`Save failed: ${msg}`);
      }
    } finally {
      setSaving(false);
    }
  }

  function resetSection(section: SettingSection) {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of section.fields) next[f.key] = initialValues[f.key];
      return next;
    });
    toast.info(`Reverted unsaved changes in ${section.label}`);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the entire platform. All values are stored in the database and applied dynamically.
        </p>
      </div>

      {(tableMissing || rlsError) && (
        <Card className="mb-6 border-amber-500/50 bg-amber-500/10">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <CardTitle className="text-base font-semibold">
                  {tableMissing ? "Database Table 'public.site_settings' Missing" : "Row Level Security (RLS) Permission Required"}
                </CardTitle>
              </div>
              <Button size="sm" variant="outline" onClick={loadSettings} disabled={loading}>
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Retry Sync
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              {tableMissing
                ? "The table public.site_settings was not found in your Supabase database. Run this script in your Supabase SQL Editor to create it:"
                : "Your Supabase RLS policy currently restricts writing to public.site_settings. Run this script in your Supabase SQL Editor to update write permissions:"}
            </p>
            <div className="relative rounded-md bg-muted p-3 font-mono text-xs overflow-x-auto">
              <pre className="text-foreground">{SETUP_SQL}</pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 flex items-center gap-1 text-xs"
                onClick={handleCopySql}
              >
                {copiedSql ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedSql ? "Copied" : "Copy SQL"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={SETTINGS_SECTIONS[0].id} className="w-full">
        <div className="sticky top-0 z-10 -mx-2 overflow-x-auto bg-background/95 px-2 pb-3 pt-1 backdrop-blur">
          <TabsList className="flex h-auto w-max flex-wrap justify-start gap-1 bg-muted p-1">
            {SETTINGS_SECTIONS.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="text-xs md:text-sm">
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {SETTINGS_SECTIONS.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            <SectionForm
              section={section}
              values={values}
              initialValues={initialValues}
              onChange={updateValue}
              onSave={() => saveSection(section)}
              onReset={() => resetSection(section)}
              saving={saving}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
