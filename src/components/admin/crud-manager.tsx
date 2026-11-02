import { useEffect, useState, type ReactNode } from "react";
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
import { listTable, insertRow, updateRow, deleteRow } from "@/lib/admin-data";

type TableName = string;

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
  pk?: string; // primary key column name, default "id"
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
  emptyMessage = "No records yet.",
  pk = "id",
  transformIn,
  transformOut,
}: CrudManagerProps<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});

  async function load() {
    setLoading(true);
    try {
      const { rows } = await listTable<T>(table, {
        order: orderBy?.column,
        dir: orderBy ? (orderBy.ascending === false ? "desc" : "asc") : undefined,
        limit: 2000,
      });
      setRows(rows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    }
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
        toast.error(`${f.label} is required`);
        return;
      }
    }
    try {
      if (editing) {
        await updateRow(table, (editing as Record<string, unknown>)[pk] as string | number, payload, pk);
        toast.success(`${entityLabel} updated`);
      } else {
        await insertRow(table, payload);
        toast.success(`${entityLabel} created`);
      }
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Save failed");
    }
    setDialogOpen(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm(`Delete this ${entityLabel.toLowerCase()}?`)) return;
    try {
      await deleteRow(table, id);
    } catch (err) {
      return toast.error(err instanceof Error ? err.message : "Delete failed");
    }
    toast.success(`${entityLabel} deleted`);
    await load();
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} ${entityLabel.toLowerCase()}${rows.length === 1 ? "" : "s"}`}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full" onClick={openNew}>
              <Plus className="size-4" /> New {entityLabel.toLowerCase()}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? `Edit ${entityLabel.toLowerCase()}` : `New ${entityLabel.toLowerCase()}`}</DialogTitle>
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
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={save}>{editing ? "Save changes" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {rows.length === 0 && !loading ? (
          <div className="p-10 text-center text-muted-foreground">{emptyMessage}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 ${c.className ?? ""}`}>{c.header}</th>
                  ))}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={String((r as Record<string, unknown>)[pk])} className="border-t border-border">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-top ${c.className ?? ""}`}>
                        {c.render ? c.render(r) : formatCell((r as Record<string, unknown>)[c.key])}
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

function formatCell(v: unknown): ReactNode {
  if (v === null || v === undefined) return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return <Badge variant={v ? "default" : "secondary"}>{v ? "Yes" : "No"}</Badge>;
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
        <option value="">Select…</option>
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
