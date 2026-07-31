import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type TableName = keyof Database["public"]["Tables"];

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean" | "json" | "select" | "url";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  colSpan?: 1 | 2;
}

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface CrudManagerProps<T> {
  table: TableName;
  fields: FieldDef[];
  columns: ColumnDef<T>[];
  orderBy?: { column: string; ascending?: boolean };
  defaults?: Record<string, unknown>;
  entityLabel: string;
  emptyMessage?: string;
  pk?: string;
  transformIn?: (raw: Record<string, unknown>) => Record<string, unknown>;
  transformOut?: (row: T) => Record<string, unknown>;
}

export function CrudManager<T>({
  table,
  fields,
  columns,
  orderBy,
  defaults = {},
  entityLabel,
  emptyMessage,
  pk = "id",
  transformIn,
  transformOut,
}: CrudManagerProps<T>) {
  const { t } = useTranslation("admin");
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});

  async function load() {
    setLoading(true);
    const client = supabase as unknown as {
      from: (t: string) => {
        select: (c: string) => { order: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }> } & Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
    const query = client.from(table).select("*");
    const result = orderBy
      ? await query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
      : await query;
    if (result.error) toast.error(result.error.message);
    setRows(((result.data as T[]) ?? []) as T[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openNew() {
    setEditing(null);
    setForm({ ...defaults });
    setDialogOpen(true);
  }

  function openEdit(row: T) {
    setEditing(row);
    const base = transformOut ? transformOut(row) : (row as unknown as Record<string, unknown>);
    setForm({ ...base });
    setDialogOpen(true);
  }

  async function save() {
    const payload = transformIn ? transformIn(form) : form;
    for (const f of fields) {
      if (f.required && (payload[f.name] === undefined || payload[f.name] === "" || payload[f.name] === null)) {
        toast.error(t("crud.requiredField", { field: f.label }));
        return;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loose = supabase.from(table) as any;
    if (editing) {
      const { error } = await loose.update(payload).eq(pk, (editing as Record<string, unknown>)[pk]);
      if (error) return toast.error(error.message);
      toast.success(t("crud.recordUpdated", { entity: entityLabel }));
    } else {
      const { error } = await loose.insert(payload);
      if (error) return toast.error(error.message);
      toast.success(t("crud.recordCreated", { entity: entityLabel }));
    }
    setDialogOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm(t("crud.deleteConfirm", { entity: entityLabel.toLowerCase() }))) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loose = supabase.from(table) as any;
    const { error } = await loose.delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(t("crud.recordDeleted", { entity: entityLabel }));
    await load();
  }

  const defaultEmptyMsg = emptyMessage || t("crud.noRecords");

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? t("crud.loading") : `${rows.length} ${entityLabel.toLowerCase()}${rows.length === 1 ? "" : "s"}`}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full" onClick={openNew}>
              <Plus className="size-4" /> {t("crud.newRecord", { entity: entityLabel.toLowerCase() })}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing
                  ? t("crud.editRecord", { entity: entityLabel.toLowerCase() })
                  : t("crud.newRecord", { entity: entityLabel.toLowerCase() })}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.colSpan === 2 || f.type === "textarea" || f.type === "json" ? "sm:col-span-2" : "sm:col-span-1"}>
                  <Label htmlFor={f.name} className="text-xs">{f.label}{f.required ? " *" : ""}</Label>
                  <FieldInput f={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />
                  {f.helpText ? <p className="mt-1 text-xs text-muted-foreground">{f.helpText}</p> : null}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("crud.cancel")}</Button>
              <Button onClick={save}>{editing ? t("crud.saveChanges") : t("crud.create")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {rows.length === 0 && !loading ? (
          <div className="p-10 text-center text-muted-foreground">{defaultEmptyMsg}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>{c.header}</th>
                  ))}
                  <th className="px-4 py-3 text-right">{t("crud.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={String((r as Record<string, unknown>)[pk])} className="border-t border-border">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-top ${c.className ?? ""}`}>
                        {c.render ? c.render(r) : formatCell((r as Record<string, unknown>)[c.key], t)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openEdit(r)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(String((r as Record<string, unknown>)[pk]))}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function formatCell(v: unknown, t: (k: string) => string): ReactNode {
  if (v === null || v === undefined) return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return <Badge variant={v ? "default" : "secondary"}>{v ? t("crud.yes") : t("crud.no")}</Badge>;
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return <code className="text-xs">{JSON.stringify(v).slice(0, 60)}…</code>;
  const s = String(v);
  if (s.length > 80) return s.slice(0, 80) + "…";
  return s;
}

function FieldInput({
  f,
  value,
  onChange,
}: {
  f: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const { t } = useTranslation("admin");

  if (f.type === "textarea") {
    return (
      <Textarea
        id={f.name}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={f.placeholder}
        rows={5}
        className="mt-1"
      />
    );
  }
  if (f.type === "json") {
    return (
      <Textarea
        id={f.name}
        value={typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={f.placeholder ?? "{}"}
        rows={6}
        className="mt-1 font-mono text-xs"
      />
    );
  }
  if (f.type === "boolean") {
    return (
      <div className="mt-2">
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }
  if (f.type === "number") {
    return (
      <Input
        id={f.name}
        type="number"
        value={(value as number | string) ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        placeholder={f.placeholder}
        className="mt-1"
      />
    );
  }
  if (f.type === "select") {
    return (
      <select
        id={f.name}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">{t("crud.select")}</option>
        {f.options?.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }
  return (
    <Input
      id={f.name}
      type={f.type === "url" ? "url" : "text"}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={f.placeholder}
      className="mt-1"
    />
  );
}
