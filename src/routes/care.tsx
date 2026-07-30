import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  Dog,
  Loader2,
  Plus,
  Scale,
  Stethoscope,
  Syringe,
  Trash2,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Pet Care Planner — Reminders, Weight & Health | FurTools" },
      {
        name: "description",
        content:
          "Track vaccinations, medications, feeding, walking, weight, and health history for each of your pets — synced across your devices.",
      },
      { property: "og:title", content: "Pet Care Planner — FurTools" },
      { property: "og:description", content: "Reminders, weight, and health history for your pets." },
      { property: "og:url", content: "/care" },
    ],
    links: [{ rel: "canonical", href: "/care" }],
  }),
  component: CarePage,
});

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birthdate: string | null;
  weight: number | null;
  weight_unit: string;
  notes: string | null;
}
interface Reminder {
  id: string;
  pet_id: string;
  kind: string;
  title: string;
  notes: string | null;
  next_at: string | null;
  recurrence: string | null;
  completed: boolean;
}
interface WeightLog {
  id: string;
  pet_id: string;
  weight: number;
  weight_unit: string;
  logged_at: string;
  notes: string | null;
}
interface HealthEvent {
  id: string;
  pet_id: string;
  kind: string;
  title: string;
  notes: string | null;
  occurred_at: string;
}

function CarePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" /> Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Care Planner" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Pet Care Planner
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Reminders, weight tracking, and health history for every pet — synced to your account.
        </p>
      </header>

      {user ? <CareDashboard userId={user.id} /> : <SignInPrompt />}
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
      <Dog className="mx-auto size-12 text-primary" aria-hidden />
      <h2 className="mt-4 font-display text-2xl font-semibold">Sign in to sync your pets</h2>
      <p className="mt-2 text-muted-foreground">
        Create a free account to save your pets, set reminders, and track weight over time — from
        any device.
      </p>
      <div className="mt-6">
        <Button asChild size="lg">
          <Link to="/auth">Sign in or create an account</Link>
        </Button>
      </div>
    </div>
  );
}

function CareDashboard({ userId }: { userId: string }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshPets() {
    setLoading(true);
    const { data } = await supabase
      .from("pets")
      .select("id,name,species,breed,birthdate,weight,weight_unit,notes")
      .order("created_at");
    const list = (data ?? []) as Pet[];
    setPets(list);
    if (list.length && !selectedId) setSelectedId(list[0].id);
    setLoading(false);
  }

  useEffect(() => {
    refreshPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = pets.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 flex items-center justify-between font-display text-lg font-semibold">
          <span>Your pets</span>
          <span className="text-xs text-muted-foreground">{pets.length}</span>
        </h2>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <ul className="space-y-1">
            {pets.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition " +
                    (p.id === selectedId
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent")
                  }
                >
                  <div className="font-medium">{p.name}</div>
                  <div className={"text-xs " + (p.id === selectedId ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {p.species}{p.breed ? ` · ${p.breed}` : ""}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <AddPetForm userId={userId} onAdded={refreshPets} />
        </div>
      </aside>

      <div>
        {selected ? (
          <PetDetail pet={selected} userId={userId} onChanged={refreshPets} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Add your first pet to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function AddPetForm({ userId, onAdded }: { userId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dog");
  const [breed, setBreed] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await supabase.from("pets").insert({
      user_id: userId,
      name: name.trim(),
      species,
      breed: breed || null,
    });
    setName("");
    setBreed("");
    setSaving(false);
    setOpen(false);
    onAdded();
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="w-full" onClick={() => setOpen(true)}>
        <Plus className="mr-1 size-4" /> Add pet
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <select
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="bird">Bird</option>
        <option value="rabbit">Rabbit</option>
        <option value="hamster">Hamster</option>
        <option value="fish">Fish</option>
        <option value="horse">Horse</option>
        <option value="other">Other</option>
      </select>
      <Input placeholder="Breed (optional)" value={breed} onChange={(e) => setBreed(e.target.value)} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving} className="flex-1">
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function PetDetail({ pet, userId, onChanged }: { pet: Pet; userId: string; onChanged: () => void }) {
  const [tab, setTab] = useState<"reminders" | "weight" | "health">("reminders");

  async function deletePet() {
    if (!confirm(`Delete ${pet.name}? All reminders and logs will be removed.`)) return;
    await supabase.from("pets").delete().eq("id", pet.id);
    onChanged();
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">{pet.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground capitalize">
            {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}
            {pet.birthdate ? ` · Born ${new Date(pet.birthdate).toLocaleDateString()}` : ""}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={deletePet}>
          <Trash2 className="mr-1 size-4" /> Delete
        </Button>
      </div>

      <div className="flex gap-1 border-b border-border p-2">
        <TabButton active={tab === "reminders"} onClick={() => setTab("reminders")} icon={<Syringe className="size-4" />}>
          Reminders
        </TabButton>
        <TabButton active={tab === "weight"} onClick={() => setTab("weight")} icon={<Scale className="size-4" />}>
          Weight
        </TabButton>
        <TabButton active={tab === "health"} onClick={() => setTab("health")} icon={<Stethoscope className="size-4" />}>
          Health
        </TabButton>
      </div>

      <div className="p-5">
        {tab === "reminders" && <RemindersTab pet={pet} userId={userId} />}
        {tab === "weight" && <WeightTab pet={pet} userId={userId} />}
        {tab === "health" && <HealthTab pet={pet} userId={userId} />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition " +
        (active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")
      }
    >
      {icon}
      {children}
    </button>
  );
}

function RemindersTab({ pet, userId }: { pet: Pet; userId: string }) {
  const [items, setItems] = useState<Reminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("vaccination");
  const [nextAt, setNextAt] = useState("");
  const [recurrence, setRecurrence] = useState("");
  const [notes, setNotes] = useState("");

  async function load() {
    const { data } = await supabase
      .from("pet_reminders")
      .select("id,pet_id,kind,title,notes,next_at,recurrence,completed")
      .eq("pet_id", pet.id)
      .order("next_at", { ascending: true });
    setItems((data ?? []) as Reminder[]);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pet.id]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from("pet_reminders").insert({
      user_id: userId,
      pet_id: pet.id,
      kind,
      title: title.trim(),
      next_at: nextAt || null,
      recurrence: recurrence || null,
      notes: notes || null,
    });
    setTitle(""); setNextAt(""); setNotes(""); setRecurrence(""); setShowAdd(false);
    load();
  }
  async function toggle(r: Reminder) {
    await supabase.from("pet_reminders").update({ completed: !r.completed }).eq("id", r.id);
    load();
  }
  async function del(id: string) {
    await supabase.from("pet_reminders").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Upcoming reminders</h3>
        <Button size="sm" variant="outline" onClick={() => setShowAdd((s) => !s)}>
          <Plus className="mr-1 size-4" /> Add
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={add} className="mb-6 grid gap-2 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
          <Input placeholder="Title (e.g. Rabies booster)" value={title} onChange={(e) => setTitle(e.target.value)} required className="sm:col-span-2" />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="vaccination">Vaccination</option>
            <option value="medication">Medication</option>
            <option value="feeding">Feeding</option>
            <option value="walking">Walking</option>
            <option value="grooming">Grooming</option>
            <option value="other">Other</option>
          </select>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">No recurrence</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Input type="datetime-local" value={nextAt} onChange={(e) => setNextAt(e.target.value)} />
          <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="sm:col-span-2" />
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save reminder</Button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reminders yet. Add one to get started.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              className={
                "flex items-start gap-3 rounded-xl border border-border bg-background p-3 " +
                (r.completed ? "opacity-60" : "")
              }
            >
              <input
                type="checkbox"
                checked={r.completed}
                onChange={() => toggle(r)}
                className="mt-1 size-4 accent-primary"
                aria-label={`Mark ${r.title} complete`}
              />
              <div className="flex-1">
                <div className={"font-medium " + (r.completed ? "line-through" : "")}>{r.title}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {r.kind}{r.recurrence ? ` · ${r.recurrence}` : ""}
                  {r.next_at ? (
                    <> · <Calendar className="inline size-3" /> {new Date(r.next_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</>
                  ) : null}
                </div>
                {r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}
              </div>
              <button type="button" onClick={() => del(r.id)} className="text-muted-foreground hover:text-red-600" aria-label="Delete">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WeightTab({ pet, userId }: { pet: Pet; userId: string }) {
  const [items, setItems] = useState<WeightLog[]>([]);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(pet.weight_unit || "lbs");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function load() {
    const { data } = await supabase
      .from("pet_weight_logs")
      .select("id,pet_id,weight,weight_unit,logged_at,notes")
      .eq("pet_id", pet.id)
      .order("logged_at", { ascending: true });
    setItems((data ?? []) as WeightLog[]);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pet.id]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!weight) return;
    await supabase.from("pet_weight_logs").insert({
      user_id: userId,
      pet_id: pet.id,
      weight: Number(weight),
      weight_unit: unit,
      logged_at: date,
    });
    setWeight("");
    load();
  }
  async function del(id: string) {
    await supabase.from("pet_weight_logs").delete().eq("id", id);
    load();
  }

  const chartData = items.map((i) => ({
    date: new Date(i.logged_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: Number(i.weight),
  }));

  return (
    <div>
      <form onSubmit={add} className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-border bg-muted/30 p-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Weight</span>
          <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-28" required />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Unit</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Date</span>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <Button size="sm" type="submit">Log weight</Button>
      </form>

      {chartData.length > 1 && (
        <div className="mb-6 h-56 rounded-xl border border-border bg-card p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No weight logs yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {[...items].reverse().map((i) => (
            <li key={i.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span><strong>{i.weight} {i.weight_unit}</strong> · {new Date(i.logged_at).toLocaleDateString()}</span>
              <button type="button" onClick={() => del(i.id)} className="text-muted-foreground hover:text-red-600" aria-label="Delete">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HealthTab({ pet, userId }: { pet: Pet; userId: string }) {
  const [items, setItems] = useState<HealthEvent[]>([]);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("vet_visit");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function load() {
    const { data } = await supabase
      .from("pet_health_events")
      .select("id,pet_id,kind,title,notes,occurred_at")
      .eq("pet_id", pet.id)
      .order("occurred_at", { ascending: false });
    setItems((data ?? []) as HealthEvent[]);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pet.id]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from("pet_health_events").insert({
      user_id: userId,
      pet_id: pet.id,
      kind,
      title: title.trim(),
      notes: notes || null,
      occurred_at: date,
    });
    setTitle(""); setNotes("");
    load();
  }
  async function del(id: string) {
    await supabase.from("pet_health_events").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <form onSubmit={add} className="mb-6 grid gap-2 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-4">
        <Input placeholder="Title (e.g. Annual checkup)" value={title} onChange={(e) => setTitle(e.target.value)} required className="sm:col-span-2" />
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="vet_visit">Vet visit</option>
          <option value="vaccination">Vaccination</option>
          <option value="diagnosis">Diagnosis</option>
          <option value="medication">Medication</option>
          <option value="injury">Injury</option>
          <option value="note">Note</option>
        </select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="sm:col-span-4" />
        <div className="sm:col-span-4 flex justify-end">
          <Button size="sm" type="submit">Add event</Button>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No health history yet.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-6">
          {items.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[27px] top-1.5 grid size-4 place-items-center rounded-full bg-primary" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {e.kind.replace(/_/g, " ")} · {new Date(e.occurred_at).toLocaleDateString()}
                  </div>
                  {e.notes && <p className="mt-1 text-sm text-muted-foreground">{e.notes}</p>}
                </div>
                <button type="button" onClick={() => del(e.id)} className="text-muted-foreground hover:text-red-600" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
