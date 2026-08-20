import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bath, Bug, DollarSign, Download, FileText, Loader2, MapPin, NotebookPen,
  Plane, Plus, Sparkles, Trash2, Upload,
} from "lucide-react";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip as ReTooltip, XAxis, YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { deletePetFile, signedPetFileUrl, uploadPetFile } from "@/lib/pet-uploads";

/* ------------------------------------------------------------------ */
/* Shared minis                                                        */
/* ------------------------------------------------------------------ */

interface Ctx { petId: string; userId: string; petName: string }

function Shell({
  title, addLabel, onAdd, loading, empty, emptyLabel, children,
}: {
  title: string; addLabel?: string; onAdd?: () => void;
  loading: boolean; empty?: boolean; emptyLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {onAdd && addLabel && (
          <Button onClick={onAdd} size="sm" className="rounded-full">
            <Plus className="mr-1 size-4" />{addLabel}
          </Button>
        )}
      </div>
      {loading
        ? <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading…</div>
        : empty
          ? <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{emptyLabel}</div>
          : children}
    </div>
  );
}

function FormCard({ children, onSave, onCancel, busy }: {
  children: React.ReactNode; onSave: () => void; onCancel: () => void; busy: boolean;
}) {
  return (
    <div className="mb-4 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
      {children}
      <div className="sm:col-span-2 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={busy} className="rounded-full">
          {busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

function FileButton({ path, label }: { path: string; label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={async () => {
      const url = await signedPetFileUrl(path);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      else toast.error("Could not open file");
    }}>
      <Download className="mr-1 size-3.5" />{label}
    </Button>
  );
}

function fmtDate(s: string | null) {
  if (!s) return "";
  try { return new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  catch { return s; }
}

/* ------------------------------------------------------------------ */
/* Deworming                                                           */
/* ------------------------------------------------------------------ */

interface DW {
  id: string; medicine: string; dose: string | null; administered_on: string;
  next_due_date: string | null; notes: string | null; document_path: string | null;
}

export function DewormingTab({ ctx }: { ctx: Ctx }) {
  const [items, setItems] = useState<DW[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_deworming")
      .select("*").eq("pet_id", ctx.petId).order("administered_on", { ascending: false });
    setItems((data as DW[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ctx.petId]);
  return (
    <Shell title="Deworming" addLabel="Add entry" onAdd={() => setAdding(true)}
           loading={items === null} empty={items?.length === 0}
           emptyLabel="No deworming records yet.">
      {adding && <DwForm ctx={ctx} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((d) => (
          <li key={d.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium">{d.medicine}{d.dose ? ` · ${d.dose}` : ""}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Given {fmtDate(d.administered_on)}
                  {d.next_due_date && ` · Next due ${fmtDate(d.next_due_date)}`}
                </div>
                {d.notes && <p className="mt-2 text-sm text-muted-foreground">{d.notes}</p>}
              </div>
              <div className="flex gap-2">
                {d.document_path && <FileButton path={d.document_path} label="Doc" />}
                <Button variant="ghost" size="icon" onClick={async () => {
                  if (!confirm("Delete this entry?")) return;
                  if (d.document_path) await deletePetFile(d.document_path).catch(() => {});
                  await supabase.from("pet_deworming").delete().eq("id", d.id);
                  load();
                }}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function DwForm({ ctx, onDone, onCancel }: { ctx: Ctx; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ medicine: "", dose: "", administered_on: new Date().toISOString().slice(0, 10), next_due_date: "", notes: "" });
  const [doc, setDoc] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.medicine.trim()) return toast.error("Medicine name required");
    setBusy(true);
    try {
      const path = doc ? await uploadPetFile(ctx.userId, ctx.petId, "deworming", doc) : null;
      const { error } = await supabase.from("pet_deworming").insert({
        pet_id: ctx.petId, user_id: ctx.userId, medicine: f.medicine.trim(),
        dose: f.dose || null, administered_on: f.administered_on,
        next_due_date: f.next_due_date || null, notes: f.notes || null, document_path: path,
      });
      if (error) throw error;
      toast.success("Deworming added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <F label="Medicine *"><Input value={f.medicine} onChange={(e) => setF({ ...f, medicine: e.target.value })} /></F>
      <F label="Dose"><Input value={f.dose} onChange={(e) => setF({ ...f, dose: e.target.value })} placeholder="e.g. 1 tablet" /></F>
      <F label="Given on"><Input type="date" value={f.administered_on} onChange={(e) => setF({ ...f, administered_on: e.target.value })} /></F>
      <F label="Next due"><Input type="date" value={f.next_due_date} onChange={(e) => setF({ ...f, next_due_date: e.target.value })} /></F>
      <F label="Notes" full><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></F>
      <F label="Document" full><Input type="file" accept="image/*,application/pdf" onChange={(e) => setDoc(e.target.files?.[0] ?? null)} /></F>
    </FormCard>
  );
}

/* ------------------------------------------------------------------ */
/* Grooming                                                            */
/* ------------------------------------------------------------------ */

interface GR {
  id: string; service_type: string; performed_on: string; next_due_date: string | null;
  groomer: string | null; cost: number | null; currency: string | null; notes: string | null;
}

const GROOMING_TYPES = ["Bath", "Haircut", "Nail Trim", "Teeth Cleaning", "Ear Cleaning", "Tick Treatment"];

export function GroomingTab({ ctx }: { ctx: Ctx }) {
  const [items, setItems] = useState<GR[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_grooming")
      .select("*").eq("pet_id", ctx.petId).order("performed_on", { ascending: false });
    setItems((data as GR[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ctx.petId]);
  return (
    <Shell title="Grooming" addLabel="Add grooming" onAdd={() => setAdding(true)}
           loading={items === null} empty={items?.length === 0}
           emptyLabel="No grooming logs yet.">
      {adding && <GrForm ctx={ctx} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((g) => (
          <li key={g.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium">{g.service_type}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {fmtDate(g.performed_on)}
                  {g.next_due_date && ` · Next ${fmtDate(g.next_due_date)}`}
                  {g.groomer && ` · ${g.groomer}`}
                  {g.cost != null && ` · ${g.currency ?? "USD"} ${g.cost}`}
                </div>
                {g.notes && <p className="mt-2 text-sm text-muted-foreground">{g.notes}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={async () => {
                if (!confirm("Delete this entry?")) return;
                await supabase.from("pet_grooming").delete().eq("id", g.id);
                load();
              }}><Trash2 className="size-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function GrForm({ ctx, onDone, onCancel }: { ctx: Ctx; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({
    service_type: "Bath", performed_on: new Date().toISOString().slice(0, 10),
    next_due_date: "", groomer: "", cost: "", currency: "USD", notes: "",
  });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      const { error } = await supabase.from("pet_grooming").insert({
        pet_id: ctx.petId, user_id: ctx.userId, service_type: f.service_type,
        performed_on: f.performed_on, next_due_date: f.next_due_date || null,
        groomer: f.groomer || null, cost: f.cost ? Number(f.cost) : null,
        currency: f.currency, notes: f.notes || null,
      });
      if (error) throw error;
      toast.success("Grooming saved");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <F label="Service">
        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={f.service_type} onChange={(e) => setF({ ...f, service_type: e.target.value })}>
          {GROOMING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </F>
      <F label="Performed on"><Input type="date" value={f.performed_on} onChange={(e) => setF({ ...f, performed_on: e.target.value })} /></F>
      <F label="Next due"><Input type="date" value={f.next_due_date} onChange={(e) => setF({ ...f, next_due_date: e.target.value })} /></F>
      <F label="Groomer"><Input value={f.groomer} onChange={(e) => setF({ ...f, groomer: e.target.value })} /></F>
      <F label="Cost"><Input type="number" step="0.01" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value })} /></F>
      <F label="Currency"><Input value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} /></F>
      <F label="Notes" full><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></F>
    </FormCard>
  );
}

/* ------------------------------------------------------------------ */
/* Expenses                                                            */
/* ------------------------------------------------------------------ */

interface EX {
  id: string; category: string; amount: number; currency: string;
  spent_on: string; vendor: string | null; notes: string | null; receipt_path: string | null;
}

const EXPENSE_CATEGORIES = ["Food", "Medicine", "Vet", "Insurance", "Toys", "Accessories", "Training", "Travel", "Grooming", "Other"];
const CHART_COLORS = ["#c26e5a", "#8a9a5b", "#e9b872", "#5f7f97", "#a86ab9", "#3f9c8f", "#d97a95", "#6c9a5a", "#c0a674", "#7f7f7f"];

export function ExpensesTab({ ctx }: { ctx: Ctx }) {
  const [items, setItems] = useState<EX[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_expenses")
      .select("*").eq("pet_id", ctx.petId).order("spent_on", { ascending: false });
    setItems((data as EX[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ctx.petId]);

  const totals = useMemo(() => {
    const list = items ?? [];
    const byCat: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    let total = 0;
    for (const e of list) {
      byCat[e.category] = (byCat[e.category] ?? 0) + Number(e.amount);
      const m = e.spent_on.slice(0, 7);
      byMonth[m] = (byMonth[m] ?? 0) + Number(e.amount);
      total += Number(e.amount);
    }
    return {
      total,
      cat: Object.entries(byCat).map(([name, value]) => ({ name, value })),
      month: Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => ({ month, total })),
      currency: list[0]?.currency ?? "USD",
    };
  }, [items]);

  return (
    <Shell title="Expenses" addLabel="Add expense" onAdd={() => setAdding(true)}
           loading={items === null} empty={items?.length === 0}
           emptyLabel="No expenses tracked yet.">
      {adding && <ExForm ctx={ctx} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">Total spent</div>
          <div className="mt-1 font-display text-3xl font-semibold">{totals.currency} {totals.total.toFixed(2)}</div>
          {totals.month.length > 0 && (
            <div className="mt-4 h-48">
              <ResponsiveContainer>
                <BarChart data={totals.month}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <ReTooltip />
                  <Bar dataKey="total" fill="#c26e5a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">By category</div>
          {totals.cat.length > 0 ? (
            <div className="mt-2 h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={totals.cat} dataKey="value" nameKey="name" outerRadius={80} label>
                    {totals.cat.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="mt-4 text-sm text-muted-foreground">Add expenses to see charts.</div>}
        </div>
      </div>
      <ul className="space-y-3">
        {items?.map((e) => (
          <li key={e.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium">{e.category} · {e.currency} {Number(e.amount).toFixed(2)}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {fmtDate(e.spent_on)}{e.vendor && ` · ${e.vendor}`}
                </div>
                {e.notes && <p className="mt-2 text-sm text-muted-foreground">{e.notes}</p>}
              </div>
              <div className="flex gap-2">
                {e.receipt_path && <FileButton path={e.receipt_path} label="Receipt" />}
                <Button variant="ghost" size="icon" onClick={async () => {
                  if (!confirm("Delete this expense?")) return;
                  if (e.receipt_path) await deletePetFile(e.receipt_path).catch(() => {});
                  await supabase.from("pet_expenses").delete().eq("id", e.id);
                  load();
                }}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function ExForm({ ctx, onDone, onCancel }: { ctx: Ctx; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({
    category: "Food", amount: "", currency: "USD",
    spent_on: new Date().toISOString().slice(0, 10), vendor: "", notes: "",
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.amount) return toast.error("Amount required");
    setBusy(true);
    try {
      const path = receipt ? await uploadPetFile(ctx.userId, ctx.petId, "receipts", receipt) : null;
      const { error } = await supabase.from("pet_expenses").insert({
        pet_id: ctx.petId, user_id: ctx.userId, category: f.category,
        amount: Number(f.amount), currency: f.currency, spent_on: f.spent_on,
        vendor: f.vendor || null, notes: f.notes || null, receipt_path: path,
      });
      if (error) throw error;
      toast.success("Expense added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <F label="Category">
        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
          {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </F>
      <F label="Date"><Input type="date" value={f.spent_on} onChange={(e) => setF({ ...f, spent_on: e.target.value })} /></F>
      <F label="Amount"><Input type="number" step="0.01" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></F>
      <F label="Currency"><Input value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} /></F>
      <F label="Vendor"><Input value={f.vendor} onChange={(e) => setF({ ...f, vendor: e.target.value })} /></F>
      <F label="Receipt"><Input type="file" accept="image/*,application/pdf" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} /></F>
      <F label="Notes" full><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></F>
    </FormCard>
  );
}

/* ------------------------------------------------------------------ */
/* Travel                                                              */
/* ------------------------------------------------------------------ */

interface TR {
  id: string; destination: string; start_date: string; end_date: string | null;
  transport: string | null; vaccination_checked: boolean; notes: string | null;
}

export function TravelTab({ ctx }: { ctx: Ctx }) {
  const [items, setItems] = useState<TR[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_travel")
      .select("*").eq("pet_id", ctx.petId).order("start_date", { ascending: false });
    setItems((data as TR[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ctx.petId]);
  return (
    <Shell title="Travel log" addLabel="Add trip" onAdd={() => setAdding(true)}
           loading={items === null} empty={items?.length === 0}
           emptyLabel="No trips logged yet.">
      {adding && <TrForm ctx={ctx} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((t) => (
          <li key={t.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium flex items-center gap-2"><MapPin className="size-4 text-primary" />{t.destination}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {fmtDate(t.start_date)}{t.end_date && ` – ${fmtDate(t.end_date)}`}
                  {t.transport && ` · ${t.transport}`}
                  {t.vaccination_checked && " · ✓ Vaccinations verified"}
                </div>
                {t.notes && <p className="mt-2 text-sm text-muted-foreground">{t.notes}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={async () => {
                if (!confirm("Delete this trip?")) return;
                await supabase.from("pet_travel").delete().eq("id", t.id);
                load();
              }}><Trash2 className="size-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function TrForm({ ctx, onDone, onCancel }: { ctx: Ctx; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({
    destination: "", start_date: new Date().toISOString().slice(0, 10), end_date: "",
    transport: "car", vaccination_checked: false, notes: "",
  });
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.destination.trim()) return toast.error("Destination required");
    setBusy(true);
    try {
      const { error } = await supabase.from("pet_travel").insert({
        pet_id: ctx.petId, user_id: ctx.userId, destination: f.destination.trim(),
        start_date: f.start_date, end_date: f.end_date || null,
        transport: f.transport || null, vaccination_checked: f.vaccination_checked,
        notes: f.notes || null,
      });
      if (error) throw error;
      toast.success("Trip added");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <F label="Destination *" full><Input value={f.destination} onChange={(e) => setF({ ...f, destination: e.target.value })} /></F>
      <F label="Start date"><Input type="date" value={f.start_date} onChange={(e) => setF({ ...f, start_date: e.target.value })} /></F>
      <F label="End date"><Input type="date" value={f.end_date} onChange={(e) => setF({ ...f, end_date: e.target.value })} /></F>
      <F label="Transport">
        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={f.transport} onChange={(e) => setF({ ...f, transport: e.target.value })}>
          <option value="car">Car</option><option value="plane">Plane</option>
          <option value="train">Train</option><option value="boat">Boat</option>
          <option value="other">Other</option>
        </select>
      </F>
      <F label="Vaccinations verified">
        <label className="flex h-10 items-center gap-2 text-sm">
          <input type="checkbox" checked={f.vaccination_checked} onChange={(e) => setF({ ...f, vaccination_checked: e.target.checked })} />
          Confirmed with vet
        </label>
      </F>
      <F label="Notes" full><Textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></F>
    </FormCard>
  );
}

/* ------------------------------------------------------------------ */
/* Journal                                                             */
/* ------------------------------------------------------------------ */

interface JR {
  id: string; entry_date: string; mood: string | null;
  entry: string; tags: string[] | null; photo_path: string | null;
}

const MOODS = ["😊 Happy", "🙂 Calm", "😴 Sleepy", "🤒 Unwell", "😾 Grumpy", "🤩 Playful", "😟 Anxious"];

export function JournalTab({ ctx }: { ctx: Ctx }) {
  const [items, setItems] = useState<JR[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  async function load() {
    const { data } = await supabase.from("pet_journal")
      .select("*").eq("pet_id", ctx.petId).order("entry_date", { ascending: false });
    const list = (data as JR[]) ?? [];
    setItems(list);
    const urls: Record<string, string> = {};
    await Promise.all(list.map(async (j) => {
      if (j.photo_path) {
        const u = await signedPetFileUrl(j.photo_path);
        if (u) urls[j.id] = u;
      }
    }));
    setPhotoUrls(urls);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ctx.petId]);
  return (
    <Shell title="Journal" addLabel="New entry" onAdd={() => setAdding(true)}
           loading={items === null} empty={items?.length === 0}
           emptyLabel="No journal entries yet.">
      {adding && <JrForm ctx={ctx} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((j) => (
          <li key={j.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <NotebookPen className="size-3.5" />
                  {fmtDate(j.entry_date)}{j.mood && ` · ${j.mood}`}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{j.entry}</p>
                {j.tags && j.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {j.tags.map((t) => <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs">{t}</span>)}
                  </div>
                )}
              </div>
              {photoUrls[j.id] && <img src={photoUrls[j.id]} alt="" className="size-24 rounded-lg object-cover" />}
              <Button variant="ghost" size="icon" onClick={async () => {
                if (!confirm("Delete this entry?")) return;
                if (j.photo_path) await deletePetFile(j.photo_path).catch(() => {});
                await supabase.from("pet_journal").delete().eq("id", j.id);
                load();
              }}><Trash2 className="size-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function JrForm({ ctx, onDone, onCancel }: { ctx: Ctx; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ entry_date: new Date().toISOString().slice(0, 10), mood: "", entry: "", tags: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.entry.trim()) return toast.error("Entry required");
    setBusy(true);
    try {
      const path = photo ? await uploadPetFile(ctx.userId, ctx.petId, "journal", photo) : null;
      const { error } = await supabase.from("pet_journal").insert({
        pet_id: ctx.petId, user_id: ctx.userId, entry_date: f.entry_date,
        mood: f.mood || null, entry: f.entry.trim(),
        tags: f.tags ? f.tags.split(",").map((s) => s.trim()).filter(Boolean) : null,
        photo_path: path,
      });
      if (error) throw error;
      toast.success("Entry saved");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <F label="Date"><Input type="date" value={f.entry_date} onChange={(e) => setF({ ...f, entry_date: e.target.value })} /></F>
      <F label="Mood">
        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={f.mood} onChange={(e) => setF({ ...f, mood: e.target.value })}>
          <option value="">—</option>
          {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </F>
      <F label="Entry *" full><Textarea rows={5} value={f.entry} onChange={(e) => setF({ ...f, entry: e.target.value })} /></F>
      <F label="Tags (comma-separated)"><Input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} placeholder="behavior, training" /></F>
      <F label="Photo"><Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} /></F>
    </FormCard>
  );
}

/* ------------------------------------------------------------------ */
/* Documents library — aggregates every upload across the pet          */
/* ------------------------------------------------------------------ */

interface DocRow { id: string; label: string; kind: string; path: string; date: string | null }

export function DocumentsTab({ ctx }: { ctx: Ctx }) {
  const [docs, setDocs] = useState<DocRow[] | null>(null);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [ctx.petId]);
  async function load() {
    const [vac, vet, med, dw, ex, jr] = await Promise.all([
      supabase.from("pet_vaccinations").select("id,vaccine_name,given_at,certificate_path").eq("pet_id", ctx.petId),
      supabase.from("pet_vet_visits").select("id,reason,visited_at,prescription_path,invoice_path").eq("pet_id", ctx.petId),
      supabase.from("pet_medications").select("id,medicine_name,start_date,prescription_path").eq("pet_id", ctx.petId),
      supabase.from("pet_deworming").select("id,medicine,administered_on,document_path").eq("pet_id", ctx.petId),
      supabase.from("pet_expenses").select("id,category,spent_on,receipt_path").eq("pet_id", ctx.petId),
      supabase.from("pet_journal").select("id,entry_date,photo_path").eq("pet_id", ctx.petId),
    ]);
    const rows: DocRow[] = [];
    (vac.data ?? []).forEach((r: any) => r.certificate_path && rows.push({ id: `vac-${r.id}`, label: `${r.vaccine_name} — Certificate`, kind: "Vaccination", path: r.certificate_path, date: r.given_at }));
    (vet.data ?? []).forEach((r: any) => {
      if (r.prescription_path) rows.push({ id: `vet-rx-${r.id}`, label: `${r.reason ?? "Vet visit"} — Prescription`, kind: "Vet", path: r.prescription_path, date: r.visited_at });
      if (r.invoice_path) rows.push({ id: `vet-inv-${r.id}`, label: `${r.reason ?? "Vet visit"} — Invoice`, kind: "Vet", path: r.invoice_path, date: r.visited_at });
    });
    (med.data ?? []).forEach((r: any) => r.prescription_path && rows.push({ id: `med-${r.id}`, label: `${r.medicine_name} — Prescription`, kind: "Medicine", path: r.prescription_path, date: r.start_date }));
    (dw.data ?? []).forEach((r: any) => r.document_path && rows.push({ id: `dw-${r.id}`, label: `${r.medicine} — Doc`, kind: "Deworming", path: r.document_path, date: r.administered_on }));
    (ex.data ?? []).forEach((r: any) => r.receipt_path && rows.push({ id: `ex-${r.id}`, label: `${r.category} — Receipt`, kind: "Expense", path: r.receipt_path, date: r.spent_on }));
    (jr.data ?? []).forEach((r: any) => r.photo_path && rows.push({ id: `jr-${r.id}`, label: "Journal photo", kind: "Journal", path: r.photo_path, date: r.entry_date }));
    rows.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    setDocs(rows);
  }
  return (
    <Shell title="Documents" loading={docs === null} empty={docs?.length === 0}
           emptyLabel="No documents yet. Upload certificates, prescriptions, or receipts to build a private library.">
      <ul className="grid gap-3 sm:grid-cols-2">
        {docs?.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-primary">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.kind}{d.date && ` · ${fmtDate(d.date)}`}</div>
              </div>
            </div>
            <FileButton path={d.path} label="Open" />
          </li>
        ))}
      </ul>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* AI Health Summary                                                   */
/* ------------------------------------------------------------------ */

export function AiSummaryTab({ ctx }: { ctx: Ctx }) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"summary" | "reminders" | "feeding" | "activity">("summary");
  const requestedRef = useRef(false);

  async function run(kind: typeof mode) {
    setLoading(true);
    setSummary("");
    setMode(kind);
    try {
      // Compose de-identified pet fact sheet from database
      const [pet, vac, med, vet, wt, alg, dw, gr] = await Promise.all([
        supabase.from("pets").select("name,species,breed,gender,birthdate,weight,weight_unit,neutered,medical_notes").eq("id", ctx.petId).maybeSingle(),
        supabase.from("pet_vaccinations").select("vaccine_name,given_at,next_due_at").eq("pet_id", ctx.petId),
        supabase.from("pet_medications").select("medicine_name,purpose,dosage,frequency,start_date,end_date,active").eq("pet_id", ctx.petId),
        supabase.from("pet_vet_visits").select("reason,diagnosis,visited_at,follow_up_date").eq("pet_id", ctx.petId).order("visited_at", { ascending: false }).limit(10),
        supabase.from("pet_weight_logs").select("weight,weight_unit,logged_at").eq("pet_id", ctx.petId).order("logged_at", { ascending: false }).limit(12),
        supabase.from("pet_allergies").select("allergen,severity,symptoms").eq("pet_id", ctx.petId),
        supabase.from("pet_deworming").select("medicine,administered_on,next_due_date").eq("pet_id", ctx.petId),
        supabase.from("pet_grooming").select("service_type,performed_on,next_due_date").eq("pet_id", ctx.petId).order("performed_on", { ascending: false }).limit(10),
      ]);

      const facts = {
        pet: pet.data,
        vaccinations: vac.data,
        medications: med.data,
        vet_visits: vet.data,
        recent_weights: wt.data,
        allergies: alg.data,
        deworming: dw.data,
        grooming: gr.data,
      };

      const prompts: Record<typeof mode, string> = {
        summary: "Please summarize this pet's health record in plain English for the owner. Highlight patterns, upcoming due items, and gaps in preventive care. Do NOT diagnose.",
        reminders: "Based on this pet's records, suggest the most important upcoming reminders (vaccines, deworming, grooming, vet follow-ups) with target dates.",
        feeding: "Suggest a general feeding routine appropriate for this pet's species, breed, weight, and age. Include portion guidance frameworks (not exact medical prescriptions).",
        activity: "Suggest an appropriate exercise, enrichment, and grooming routine based on this pet's species, breed, and age.",
      };

      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistant: "care",
          messages: [{
            role: "user",
            content: `${prompts[kind]}\n\nPet record (JSON):\n${JSON.stringify(facts, null, 2)}`,
          }],
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error ?? "AI request failed");
      const text = j?.content ?? j?.choices?.[0]?.message?.content ?? j?.message ?? "";
      setSummary(String(text).trim() || "No response.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!requestedRef.current) { requestedRef.current = true; run("summary"); }
    // eslint-disable-next-line
  }, [ctx.petId]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          <Sparkles className="size-5 text-primary" /> AI insights for {ctx.petName}
        </h2>
        <div className="flex flex-wrap gap-2">
          {(["summary", "reminders", "feeding", "activity"] as const).map((k) => (
            <Button key={k} size="sm" variant={mode === k ? "default" : "outline"}
                    className="rounded-full capitalize" onClick={() => run(k)} disabled={loading}>
              {k}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
        This information is for educational purposes only and is not a substitute for professional veterinary advice.
      </div>
      <div className="mt-4 min-h-[200px] rounded-2xl border border-border bg-card p-6">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Generating {mode}…
          </div>
        ) : summary ? (
          <FormattedMarkdown content={summary} />
        ) : (
          <div className="text-sm text-muted-foreground">Pick a mode above to generate insights.</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

// Preserve import for icons used only in aliases
export const _icons = { Bath, Bug, DollarSign, Plane, NotebookPen, Upload };
