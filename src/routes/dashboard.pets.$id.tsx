import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft, Calendar, Cake, ChevronRight, Download, Loader2, PawPrint, Pencil,
  Pill, Plus, Scale, Stethoscope, Syringe, Trash2, TriangleAlert, Upload,
} from "lucide-react";
import {
  Line, LineChart, ResponsiveContainer, Tooltip as ReTooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { signedPetFileUrl, uploadPetFile, deletePetFile } from "@/lib/pet-uploads";
import {
  DewormingTab, GroomingTab, ExpensesTab, TravelTab, JournalTab, DocumentsTab, AiSummaryTab,
} from "@/components/pets/extra-tabs";
import { SpeciesSpecificsTab } from "@/components/pets/species-specifics-tab";
import { SPECIES_SELECT_OPTIONS, getSpeciesConfig } from "@/data/species-config";


export const Route = createFileRoute("/dashboard/pets/$id")({
  head: () => ({
    meta: [
      { title: "Pet profile — FurTools" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PetDetailPage,
});

interface Pet {
  id: string; user_id: string; name: string; species: string; breed: string | null;
  is_mixed_breed: boolean; secondary_breed: string | null; gender: string | null;
  birthdate: string | null; weight: number | null; weight_unit: string;
  height: number | null; height_unit: string; color: string | null;
  microchip_number: string | null; neutered: boolean; adoption_date: string | null;
  breeder_shelter: string | null; favorite_toy: string | null; favorite_food: string | null;
  medical_notes: string | null; notes: string | null; avatar_url: string | null;
  species_data: Record<string, unknown> | null;
}

import { getActiveUser, type ActiveUser } from "@/lib/custom-google-auth";

function PetDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeUser, setActiveUser] = useState<ActiveUser | null | undefined>(undefined);
  const [pet, setPet] = useState<Pet | null | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getActiveUser().then(setActiveUser);
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      getActiveUser().then(setActiveUser);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function loadPet() {
    const { data } = await supabase.from("pets").select("*").eq("id", id).maybeSingle();
    setPet((data as Pet | null) ?? null);
    if (data?.avatar_url) setAvatarUrl(await signedPetFileUrl(data.avatar_url));
  }
  useEffect(() => { if (activeUser) loadPet(); /* eslint-disable-next-line */ }, [activeUser, id]);

  if (activeUser === undefined || pet === undefined) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading…</div>
      </div>
    );
  }
  if (!activeUser) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Please <Link to="/auth" className="text-primary underline">sign in</Link>.</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Pet not found.</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/dashboard">Back to dashboard</Link></Button>
      </div>
    );
  }

  const age = calcAge(pet.birthdate);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs items={[{ label: "My Pets", to: "/dashboard" }, { label: pet.name }]} />
      <div className="mt-6 flex flex-wrap items-start gap-6">
        <div className="flex size-28 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/25">
          {avatarUrl ? <img src={avatarUrl} alt={pet.name} className="size-full object-cover" /> : <PawPrint className="size-14 text-primary/70" />}
        </div>
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard"><ArrowLeft className="mr-1 size-4" /> All pets</Link></Button>
          </div>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">{pet.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {[pet.species, pet.breed, pet.gender].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {age && <StatChip icon={<Cake className="size-3.5" />} label={age} />}
            {pet.weight != null && <StatChip icon={<Scale className="size-3.5" />} label={`${pet.weight} ${pet.weight_unit}`} />}
            {pet.neutered && <StatChip label="Neutered" />}
            {pet.microchip_number && <StatChip label={`Chip ${pet.microchip_number.slice(-6)}`} />}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              setActiveTab("overview");
              setTimeout(() => document.getElementById("pet-edit-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
            }}
          >
            <Pencil className="mr-1 size-4" /> Edit
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              if (!confirm(`Delete ${pet.name}? This removes all records for this pet.`)) return;
              const { error } = await supabase.from("pets").delete().eq("id", pet.id);
              if (error) return toast.error(error.message);
              toast.success("Pet deleted");
              navigate({ to: "/dashboard" });
            }}
          >
            <Trash2 className="mr-1 size-4" /> Delete
          </Button>
        </div>
      </div>

      {(() => {
        const cfg = getSpeciesConfig(pet.species);
        return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Edit Profile</TabsTrigger>
          <TabsTrigger value="specifics">{cfg?.singular ?? "Species"} details</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          {(cfg?.showsVaccinations ?? true) && <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>}
          <TabsTrigger value="medications">Medicines</TabsTrigger>
          {(cfg?.showsDeworming ?? true) && <TabsTrigger value="deworming">Deworming</TabsTrigger>}
          {(cfg?.showsGrooming ?? true) && <TabsTrigger value="grooming">Grooming</TabsTrigger>}
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="vet">Vet Visits</TabsTrigger>
          {(cfg?.showsAllergies ?? true) && <TabsTrigger value="allergies">Allergies</TabsTrigger>}
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          {(cfg?.showsTravel ?? true) && <TabsTrigger value="travel">Travel</TabsTrigger>}
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <OverviewTab pet={pet} onSaved={loadPet} avatarUrl={avatarUrl} />
        </TabsContent>
        <TabsContent value="specifics" className="mt-6">
          <SpeciesSpecificsTab petId={pet.id} species={pet.species} initial={pet.species_data ?? {}} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6"><TimelineTab pet={pet} /></TabsContent>
        {(cfg?.showsVaccinations ?? true) && <TabsContent value="vaccinations" className="mt-6"><VaccinationsTab pet={pet} /></TabsContent>}
        <TabsContent value="medications" className="mt-6"><MedicationsTab pet={pet} /></TabsContent>
        {(cfg?.showsDeworming ?? true) && <TabsContent value="deworming" className="mt-6"><DewormingTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>}
        {(cfg?.showsGrooming ?? true) && <TabsContent value="grooming" className="mt-6"><GroomingTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>}
        <TabsContent value="weight" className="mt-6"><WeightTab pet={pet} /></TabsContent>
        <TabsContent value="vet" className="mt-6"><VetVisitsTab pet={pet} /></TabsContent>
        {(cfg?.showsAllergies ?? true) && <TabsContent value="allergies" className="mt-6"><AllergiesTab pet={pet} /></TabsContent>}
        <TabsContent value="expenses" className="mt-6"><ExpensesTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>
        {(cfg?.showsTravel ?? true) && <TabsContent value="travel" className="mt-6"><TravelTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>}
        <TabsContent value="journal" className="mt-6"><JournalTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>
        <TabsContent value="documents" className="mt-6"><DocumentsTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>
        <TabsContent value="ai" className="mt-6"><AiSummaryTab ctx={{ petId: pet.id, userId: pet.user_id, petName: pet.name }} /></TabsContent>
      </Tabs>
        );
      })()}

    </div>
  );
}

function StatChip({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
      {icon} {label}
    </span>
  );
}

/* -------- Overview -------- */
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const petEditSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name must be under 60 characters"),
  species: z.string().trim().min(1, "Species is required").max(40),
  breed: z.string().trim().max(80, "Breed must be under 80 characters").nullable(),
  secondary_breed: z.string().trim().max(80, "Secondary breed must be under 80 characters").nullable(),
  gender: z.enum(["male", "female"]).nullable(),
  birthdate: z.string().nullable().refine(
    (v) => !v || (!Number.isNaN(Date.parse(v)) && new Date(v) <= new Date()),
    "Birth date can't be in the future",
  ),
  adoption_date: z.string().nullable().refine(
    (v) => !v || (!Number.isNaN(Date.parse(v)) && new Date(v) <= new Date()),
    "Adoption date can't be in the future",
  ),
  weight: z.number().positive("Weight must be greater than 0").max(2000, "Weight looks too large").nullable(),
  height: z.number().positive("Height must be greater than 0").max(400, "Height looks too large").nullable(),
  color: z.string().trim().max(80).nullable(),
  microchip_number: z.string().trim().max(30).regex(/^[A-Za-z0-9-]*$/, "Microchip may only contain letters, numbers, and dashes").nullable(),
  breeder_shelter: z.string().trim().max(120).nullable(),
  favorite_toy: z.string().trim().max(80).nullable(),
  favorite_food: z.string().trim().max(80).nullable(),
  medical_notes: z.string().trim().max(2000, "Medical notes must be under 2000 characters").nullable(),
  notes: z.string().trim().max(2000, "Notes must be under 2000 characters").nullable(),
});

function OverviewTab({ pet, onSaved, avatarUrl }: { pet: Pet; onSaved: () => void; avatarUrl: string | null }) {
  const [form, setForm] = useState<Pet>(pet);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => { setForm(pet); setErrors({}); }, [pet]);

  async function save() {
    const trimStr = (v: string | null | undefined) => {
      const t = (v ?? "").trim();
      return t === "" ? null : t;
    };
    const candidate = {
      name: (form.name ?? "").trim(),
      species: (form.species ?? "").trim(),
      breed: trimStr(form.breed),
      secondary_breed: trimStr(form.secondary_breed),
      gender: (form.gender ?? null) as "male" | "female" | null,
      birthdate: trimStr(form.birthdate),
      adoption_date: trimStr(form.adoption_date),
      weight: form.weight ?? null,
      height: form.height ?? null,
      color: trimStr(form.color),
      microchip_number: trimStr(form.microchip_number),
      breeder_shelter: trimStr(form.breeder_shelter),
      favorite_toy: trimStr(form.favorite_toy),
      favorite_food: trimStr(form.favorite_food),
      medical_notes: trimStr(form.medical_notes),
      notes: trimStr(form.notes),
    };
    const parsed = petEditSchema.safeParse(candidate);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the highlighted fields");
      return;
    }
    if (photo) {
      if (!photo.type.startsWith("image/")) {
        setErrors({ photo: "Photo must be an image file" });
        toast.error("Photo must be an image file");
        return;
      }
      if (photo.size > MAX_PHOTO_BYTES) {
        setErrors({ photo: "Photo must be under 5 MB" });
        toast.error("Photo must be under 5 MB");
        return;
      }
    }
    setErrors({});
    setBusy(true);
    try {
      let avatar_url = form.avatar_url;
      if (photo) {
        if (pet.avatar_url) await deletePetFile(pet.avatar_url).catch(() => {});
        avatar_url = await uploadPetFile(pet.user_id, pet.id, "avatar", photo);
      }
      const { error } = await supabase.from("pets").update({
        ...parsed.data,
        is_mixed_breed: form.is_mixed_breed,
        weight_unit: form.weight_unit,
        height_unit: form.height_unit,
        neutered: form.neutered,
        avatar_url,
      }).eq("id", pet.id);
      if (error) throw error;
      toast.success("Profile saved");
      setPhoto(null);
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setBusy(false); }
  }

  const F = <K extends keyof Pet>(k: K, v: Pet[K]) => setForm((s) => ({ ...s, [k]: v }));
  return (
    <div id="pet-edit-form" className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
        <TextField label="Name *" value={form.name} onChange={(v) => F("name", v)} error={errors.name} max={60} />
        <SelectField label="Species" value={form.species} onChange={(v) => F("species", v)}
          options={SPECIES_SELECT_OPTIONS} />
        <TextField label="Primary breed" value={form.breed ?? ""} onChange={(v) => F("breed", v || null)} error={errors.breed} max={80} />
        <TextField label="Secondary breed (if mixed)" value={form.secondary_breed ?? ""} onChange={(v) => F("secondary_breed", v || null)} error={errors.secondary_breed} max={80} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_mixed_breed} onChange={(e) => F("is_mixed_breed", e.target.checked)} />
          Mixed breed
        </label>
        <SelectField label="Gender" value={form.gender ?? ""} onChange={(v) => F("gender", v || null)}
          options={[["", "—"], ["male", "Male"], ["female", "Female"]]} />
        <TextField label="Birth date" type="date" value={form.birthdate ?? ""} onChange={(v) => F("birthdate", v || null)} error={errors.birthdate} />
        <TextField label="Adoption date" type="date" value={form.adoption_date ?? ""} onChange={(v) => F("adoption_date", v || null)} error={errors.adoption_date} />
        <div className="grid grid-cols-[1fr_100px] gap-2">
          <TextField label="Weight" type="number" value={form.weight?.toString() ?? ""} onChange={(v) => F("weight", v ? Number(v) : null)} error={errors.weight} />
          <SelectField label="Unit" value={form.weight_unit} onChange={(v) => F("weight_unit", v)} options={[["lbs","lbs"],["kg","kg"]]} />
        </div>
        <div className="grid grid-cols-[1fr_100px] gap-2">
          <TextField label="Height" type="number" value={form.height?.toString() ?? ""} onChange={(v) => F("height", v ? Number(v) : null)} error={errors.height} />
          <SelectField label="Unit" value={form.height_unit} onChange={(v) => F("height_unit", v)} options={[["in","in"],["cm","cm"]]} />
        </div>
        <TextField label="Color / Markings" value={form.color ?? ""} onChange={(v) => F("color", v || null)} error={errors.color} max={80} />
        <TextField label="Microchip number" value={form.microchip_number ?? ""} onChange={(v) => F("microchip_number", v || null)} error={errors.microchip_number} max={30} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.neutered} onChange={(e) => F("neutered", e.target.checked)} />
          Neutered / Spayed
        </label>
        <TextField label="Breeder / Shelter" value={form.breeder_shelter ?? ""} onChange={(v) => F("breeder_shelter", v || null)} error={errors.breeder_shelter} max={120} />
        <TextField label="Favorite toy" value={form.favorite_toy ?? ""} onChange={(v) => F("favorite_toy", v || null)} error={errors.favorite_toy} max={80} />
        <TextField label="Favorite food" value={form.favorite_food ?? ""} onChange={(v) => F("favorite_food", v || null)} error={errors.favorite_food} max={80} />
        <div className="sm:col-span-2">
          <Label>Medical notes</Label>
          <Textarea rows={3} maxLength={2000} value={form.medical_notes ?? ""} onChange={(e) => F("medical_notes", e.target.value || null)}
            className={`mt-1.5 ${errors.medical_notes ? "border-destructive focus-visible:ring-destructive" : ""}`} />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-destructive">{errors.medical_notes ?? ""}</span>
            <span className="text-muted-foreground">{(form.medical_notes ?? "").length}/2000</span>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label>General notes</Label>
          <Textarea rows={3} maxLength={2000} value={form.notes ?? ""} onChange={(e) => F("notes", e.target.value || null)}
            className={`mt-1.5 ${errors.notes ? "border-destructive focus-visible:ring-destructive" : ""}`} />
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-destructive">{errors.notes ?? ""}</span>
            <span className="text-muted-foreground">{(form.notes ?? "").length}/2000</span>
          </div>
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button onClick={save} disabled={busy} className="rounded-full"><Pencil className="mr-1 size-4" /> {busy ? "Saving…" : "Save profile"}</Button>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Photo</h3>
          <div className="mt-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20">
            {avatarUrl ? <img src={avatarUrl} alt="" className="size-full object-cover" /> : <PawPrint className="size-16 text-primary/60" />}
          </div>
          <Input type="file" accept="image/*" className="mt-3" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
          {errors.photo && <p className="mt-2 text-xs text-destructive">{errors.photo}</p>}
          {photo && !errors.photo && <p className="mt-2 text-xs text-muted-foreground">Save profile to upload (max 5 MB).</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Medical disclaimer</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            FurTools is for educational tracking only and is not a substitute for professional veterinary advice.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* -------- Timeline -------- */
interface TLItem { id: string; date: string; kind: string; title: string; notes: string | null; }
function TimelineTab({ pet }: { pet: Pet }) {
  const [items, setItems] = useState<TLItem[] | null>(null);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pet.id]);
  async function load() {
    const [ev, vac, med, vet, wt] = await Promise.all([
      supabase.from("pet_health_events").select("id,kind,title,notes,occurred_at").eq("pet_id", pet.id),
      supabase.from("pet_vaccinations").select("id,vaccine_name,given_at,notes").eq("pet_id", pet.id),
      supabase.from("pet_medications").select("id,medicine_name,purpose,start_date").eq("pet_id", pet.id),
      supabase.from("pet_vet_visits").select("id,reason,diagnosis,visited_at").eq("pet_id", pet.id),
      supabase.from("pet_weight_logs").select("id,weight,weight_unit,logged_at,notes").eq("pet_id", pet.id),
    ]);
    const all: TLItem[] = [
      ...(ev.data ?? []).map((r) => ({ id: `ev-${r.id}`, date: r.occurred_at, kind: r.kind, title: r.title, notes: r.notes })),
      ...(vac.data ?? []).filter((r) => r.given_at).map((r) => ({ id: `vac-${r.id}`, date: r.given_at as string, kind: "vaccination", title: r.vaccine_name, notes: r.notes })),
      ...(med.data ?? []).filter((r) => r.start_date).map((r) => ({ id: `med-${r.id}`, date: r.start_date as string, kind: "medicine", title: `${r.medicine_name}${r.purpose ? " — " + r.purpose : ""}`, notes: null })),
      ...(vet.data ?? []).map((r) => ({ id: `vet-${r.id}`, date: r.visited_at, kind: "vet_visit", title: r.reason ?? "Vet visit", notes: r.diagnosis })),
      ...(wt.data ?? []).map((r) => ({ id: `wt-${r.id}`, date: r.logged_at, kind: "weight", title: `Weight: ${r.weight} ${r.weight_unit}`, notes: r.notes })),
    ];
    if (pet.birthdate) all.push({ id: "birth", date: pet.birthdate, kind: "birthday", title: "Birthday", notes: null });
    if (pet.adoption_date) all.push({ id: "adopt", date: pet.adoption_date, kind: "adoption", title: "Adoption day", notes: null });
    all.sort((a, b) => b.date.localeCompare(a.date));
    setItems(all);
  }
  if (!items) return <Skeleton />;
  if (items.length === 0) return <Empty label="No timeline events yet. Add a vaccination, weight log, or vet visit to see them here." />;
  return (
    <ol className="relative ml-3 space-y-4 border-l-2 border-border pl-6">
      {items.map((i) => (
        <li key={i.id} className="relative">
          <span className="absolute -left-[33px] top-1 grid size-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
            {kindIcon(i.kind)}
          </span>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium">{i.title}</div>
              <div className="text-xs text-muted-foreground">{fmtDate(i.date)}</div>
            </div>
            <div className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{prettyKind(i.kind)}</div>
            {i.notes && <p className="mt-2 text-sm text-muted-foreground">{i.notes}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* -------- Vaccinations -------- */
interface Vac { id: string; vaccine_name: string; given_at: string | null; next_due_at: string | null; veterinarian: string | null; clinic: string | null; notes: string | null; certificate_path: string | null; completed: boolean; }
function VaccinationsTab({ pet }: { pet: Pet }) {
  const [items, setItems] = useState<Vac[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_vaccinations").select("*").eq("pet_id", pet.id).order("next_due_at", { nullsFirst: false });
    setItems((data as Vac[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pet.id]);
  return (
    <ManagerShell
      title="Vaccinations"
      addLabel="Add vaccination"
      onAdd={() => setAdding(true)}
      empty={items?.length === 0}
      emptyLabel="No vaccinations logged yet."
      loading={items === null}
    >
      {adding && <VacForm pet={pet} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((v) => <VacItem key={v.id} v={v} onChange={load} />)}
      </ul>
    </ManagerShell>
  );
}
function VacItem({ v, onChange }: { v: Vac; onChange: () => void }) {
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-medium">{v.vaccine_name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {v.given_at && `Given ${fmtDate(v.given_at)}`}
            {v.next_due_at && ` · Next due ${fmtDate(v.next_due_at)}`}
            {v.clinic && ` · ${v.clinic}`}{v.veterinarian && ` · Dr. ${v.veterinarian}`}
          </div>
          {v.notes && <p className="mt-2 text-sm text-muted-foreground">{v.notes}</p>}
        </div>
        <div className="flex gap-2">
          {v.certificate_path && <FileButton path={v.certificate_path} label="Certificate" />}
          <Button variant="ghost" size="icon" onClick={async () => {
            if (!confirm("Delete this vaccination?")) return;
            if (v.certificate_path) await deletePetFile(v.certificate_path).catch(() => {});
            await supabase.from("pet_vaccinations").delete().eq("id", v.id);
            onChange();
          }}><Trash2 className="size-4" /></Button>
        </div>
      </div>
    </li>
  );
}
function VacForm({ pet, onDone, onCancel }: { pet: Pet; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ vaccine_name: "", given_at: "", next_due_at: "", veterinarian: "", clinic: "", notes: "" });
  const [cert, setCert] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.vaccine_name.trim()) return;
    setBusy(true);
    try {
      let certificate_path: string | null = null;
      if (cert) certificate_path = await uploadPetFile(pet.user_id, pet.id, "vaccinations", cert);
      const { error } = await supabase.from("pet_vaccinations").insert({
        user_id: pet.user_id, pet_id: pet.id,
        vaccine_name: f.vaccine_name.trim(),
        given_at: f.given_at || null, next_due_at: f.next_due_at || null,
        veterinarian: f.veterinarian || null, clinic: f.clinic || null,
        notes: f.notes || null, certificate_path, completed: !!f.given_at,
      });
      if (error) throw error;
      toast.success("Vaccination added"); onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); }
  }
  return (
    <FormCard onCancel={onCancel} onSave={save} busy={busy}>
      <TextField label="Vaccine name *" value={f.vaccine_name} onChange={(v) => setF({ ...f, vaccine_name: v })} />
      <TextField label="Date given" type="date" value={f.given_at} onChange={(v) => setF({ ...f, given_at: v })} />
      <TextField label="Next due" type="date" value={f.next_due_at} onChange={(v) => setF({ ...f, next_due_at: v })} />
      <TextField label="Veterinarian" value={f.veterinarian} onChange={(v) => setF({ ...f, veterinarian: v })} />
      <TextField label="Clinic" value={f.clinic} onChange={(v) => setF({ ...f, clinic: v })} />
      <div className="sm:col-span-2"><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="mt-1.5" /></div>
      <div className="sm:col-span-2"><Label>Certificate (PDF/image)</Label><Input type="file" accept="image/*,.pdf" className="mt-1.5" onChange={(e) => setCert(e.target.files?.[0] ?? null)} /></div>
    </FormCard>
  );
}

/* -------- Medications -------- */
interface Med { id: string; medicine_name: string; purpose: string | null; dosage: string | null; frequency: string | null; morning: boolean; afternoon: boolean; night: boolean; start_date: string | null; end_date: string | null; prescription_path: string | null; active: boolean; notes: string | null; }
function MedicationsTab({ pet }: { pet: Pet }) {
  const [items, setItems] = useState<Med[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_medications").select("*").eq("pet_id", pet.id).order("active", { ascending: false }).order("created_at", { ascending: false });
    setItems((data as Med[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pet.id]);
  return (
    <ManagerShell title="Medicines" addLabel="Add medicine" onAdd={() => setAdding(true)} empty={items?.length === 0} emptyLabel="No medicines logged yet." loading={items === null}>
      {adding && <MedForm pet={pet} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((m) => (
          <li key={m.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.medicine_name}</span>
                  {m.active ? <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">Active</span> : <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Ended</span>}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {m.purpose}{m.dosage && ` · ${m.dosage}`}{m.frequency && ` · ${m.frequency}`}
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {m.morning && <span className="rounded bg-accent px-1.5 py-0.5">Morning</span>}
                  {m.afternoon && <span className="rounded bg-accent px-1.5 py-0.5">Afternoon</span>}
                  {m.night && <span className="rounded bg-accent px-1.5 py-0.5">Night</span>}
                </div>
                {(m.start_date || m.end_date) && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {m.start_date && `From ${fmtDate(m.start_date)}`}{m.end_date && ` to ${fmtDate(m.end_date)}`}
                  </div>
                )}
                {m.notes && <p className="mt-2 text-sm text-muted-foreground">{m.notes}</p>}
              </div>
              <div className="flex gap-2">
                {m.prescription_path && <FileButton path={m.prescription_path} label="Prescription" />}
                <Button variant="ghost" size="sm" onClick={async () => {
                  await supabase.from("pet_medications").update({ active: !m.active }).eq("id", m.id);
                  load();
                }}>{m.active ? "End" : "Reactivate"}</Button>
                <Button variant="ghost" size="icon" onClick={async () => {
                  if (!confirm("Delete this medicine?")) return;
                  if (m.prescription_path) await deletePetFile(m.prescription_path).catch(() => {});
                  await supabase.from("pet_medications").delete().eq("id", m.id);
                  load();
                }}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ManagerShell>
  );
}
function MedForm({ pet, onDone, onCancel }: { pet: Pet; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ medicine_name: "", purpose: "", dosage: "", frequency: "", morning: false, afternoon: false, night: false, start_date: "", end_date: "", notes: "" });
  const [rx, setRx] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.medicine_name.trim()) return;
    setBusy(true);
    try {
      let prescription_path: string | null = null;
      if (rx) prescription_path = await uploadPetFile(pet.user_id, pet.id, "prescriptions", rx);
      const { error } = await supabase.from("pet_medications").insert({
        user_id: pet.user_id, pet_id: pet.id,
        medicine_name: f.medicine_name.trim(),
        purpose: f.purpose || null, dosage: f.dosage || null, frequency: f.frequency || null,
        morning: f.morning, afternoon: f.afternoon, night: f.night,
        start_date: f.start_date || null, end_date: f.end_date || null,
        prescription_path, notes: f.notes || null, active: true,
      });
      if (error) throw error;
      toast.success("Medicine added"); onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <TextField label="Medicine name *" value={f.medicine_name} onChange={(v) => setF({ ...f, medicine_name: v })} />
      <TextField label="Purpose" value={f.purpose} onChange={(v) => setF({ ...f, purpose: v })} />
      <TextField label="Dosage (e.g. 10 mg)" value={f.dosage} onChange={(v) => setF({ ...f, dosage: v })} />
      <TextField label="Frequency (e.g. once daily)" value={f.frequency} onChange={(v) => setF({ ...f, frequency: v })} />
      <TextField label="Start date" type="date" value={f.start_date} onChange={(v) => setF({ ...f, start_date: v })} />
      <TextField label="End date" type="date" value={f.end_date} onChange={(v) => setF({ ...f, end_date: v })} />
      <div className="sm:col-span-2 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.morning} onChange={(e) => setF({ ...f, morning: e.target.checked })} /> Morning</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.afternoon} onChange={(e) => setF({ ...f, afternoon: e.target.checked })} /> Afternoon</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={f.night} onChange={(e) => setF({ ...f, night: e.target.checked })} /> Night</label>
      </div>
      <div className="sm:col-span-2"><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="mt-1.5" /></div>
      <div className="sm:col-span-2"><Label>Prescription (PDF/image)</Label><Input type="file" accept="image/*,.pdf" className="mt-1.5" onChange={(e) => setRx(e.target.files?.[0] ?? null)} /></div>
    </FormCard>
  );
}

/* -------- Weight -------- */
interface Wt { id: string; weight: number; weight_unit: string; logged_at: string; notes: string | null; }
function WeightTab({ pet }: { pet: Pet }) {
  const [logs, setLogs] = useState<Wt[] | null>(null);
  const [w, setW] = useState(""); const [d, setD] = useState(new Date().toISOString().slice(0, 10)); const [n, setN] = useState("");
  async function load() {
    const { data } = await supabase.from("pet_weight_logs").select("*").eq("pet_id", pet.id).order("logged_at");
    setLogs((data as Wt[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pet.id]);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!w) return;
    const { error } = await supabase.from("pet_weight_logs").insert({
      user_id: pet.user_id, pet_id: pet.id, weight: Number(w), weight_unit: pet.weight_unit || "lbs", logged_at: d, notes: n || null,
    });
    if (error) return toast.error(error.message);
    setW(""); setN(""); load();
  }
  const chartData = useMemo(() => (logs ?? []).map((l) => ({ date: l.logged_at, weight: Number(l.weight) })), [logs]);
  if (logs === null) return <Skeleton />;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Weight over time</h3>
        {chartData.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No weight entries yet.</p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <ul className="mt-6 divide-y divide-border">
          {logs.slice().reverse().map((l) => (
            <li key={l.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium">{l.weight} {l.weight_unit}</span>
              <span className="text-muted-foreground">{fmtDate(l.logged_at)}</span>
              <Button variant="ghost" size="icon" onClick={async () => { await supabase.from("pet_weight_logs").delete().eq("id", l.id); load(); }}><Trash2 className="size-4" /></Button>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={add} className="space-y-3 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold">Log weight</h3>
        <TextField label={`Weight (${pet.weight_unit})`} type="number" value={w} onChange={setW} />
        <TextField label="Date" type="date" value={d} onChange={setD} />
        <div><Label>Notes</Label><Textarea rows={2} value={n} onChange={(e) => setN(e.target.value)} className="mt-1.5" /></div>
        <Button type="submit" className="w-full rounded-full"><Plus className="mr-1 size-4" />Add entry</Button>
      </form>
    </div>
  );
}

/* -------- Vet Visits -------- */
interface Vet { id: string; visited_at: string; clinic: string | null; doctor: string | null; reason: string | null; diagnosis: string | null; treatment: string | null; prescription_path: string | null; invoice_path: string | null; notes: string | null; follow_up_at: string | null; }
function VetVisitsTab({ pet }: { pet: Pet }) {
  const [items, setItems] = useState<Vet[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_vet_visits").select("*").eq("pet_id", pet.id).order("visited_at", { ascending: false });
    setItems((data as Vet[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pet.id]);
  return (
    <ManagerShell title="Vet Visits" addLabel="Add visit" onAdd={() => setAdding(true)} empty={items?.length === 0} emptyLabel="No vet visits logged yet." loading={items === null}>
      {adding && <VetForm pet={pet} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((v) => (
          <li key={v.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-medium">{v.reason ?? "Vet visit"} <span className="text-xs font-normal text-muted-foreground">— {fmtDate(v.visited_at)}</span></div>
                <div className="mt-0.5 text-xs text-muted-foreground">{[v.clinic, v.doctor && `Dr. ${v.doctor}`].filter(Boolean).join(" · ")}</div>
                {v.diagnosis && <p className="mt-2 text-sm"><span className="font-medium">Diagnosis:</span> {v.diagnosis}</p>}
                {v.treatment && <p className="mt-1 text-sm"><span className="font-medium">Treatment:</span> {v.treatment}</p>}
                {v.notes && <p className="mt-1 text-sm text-muted-foreground">{v.notes}</p>}
                {v.follow_up_at && <p className="mt-2 text-xs text-primary">Follow-up: {fmtDate(v.follow_up_at)}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {v.prescription_path && <FileButton path={v.prescription_path} label="Rx" />}
                {v.invoice_path && <FileButton path={v.invoice_path} label="Invoice" />}
                <Button variant="ghost" size="icon" onClick={async () => {
                  if (!confirm("Delete this visit?")) return;
                  if (v.prescription_path) await deletePetFile(v.prescription_path).catch(() => {});
                  if (v.invoice_path) await deletePetFile(v.invoice_path).catch(() => {});
                  await supabase.from("pet_vet_visits").delete().eq("id", v.id);
                  load();
                }}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ManagerShell>
  );
}
function VetForm({ pet, onDone, onCancel }: { pet: Pet; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ visited_at: new Date().toISOString().slice(0, 10), clinic: "", doctor: "", reason: "", diagnosis: "", treatment: "", notes: "", follow_up_at: "" });
  const [rx, setRx] = useState<File | null>(null); const [inv, setInv] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try {
      const prescription_path = rx ? await uploadPetFile(pet.user_id, pet.id, "prescriptions", rx) : null;
      const invoice_path = inv ? await uploadPetFile(pet.user_id, pet.id, "invoices", inv) : null;
      const { error } = await supabase.from("pet_vet_visits").insert({
        user_id: pet.user_id, pet_id: pet.id, visited_at: f.visited_at,
        clinic: f.clinic || null, doctor: f.doctor || null, reason: f.reason || null,
        diagnosis: f.diagnosis || null, treatment: f.treatment || null,
        prescription_path, invoice_path, notes: f.notes || null, follow_up_at: f.follow_up_at || null,
      });
      if (error) throw error;
      toast.success("Visit logged"); onDone();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); }
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <TextField label="Visit date *" type="date" value={f.visited_at} onChange={(v) => setF({ ...f, visited_at: v })} />
      <TextField label="Clinic" value={f.clinic} onChange={(v) => setF({ ...f, clinic: v })} />
      <TextField label="Doctor" value={f.doctor} onChange={(v) => setF({ ...f, doctor: v })} />
      <TextField label="Reason" value={f.reason} onChange={(v) => setF({ ...f, reason: v })} />
      <div className="sm:col-span-2"><Label>Diagnosis</Label><Textarea rows={2} value={f.diagnosis} onChange={(e) => setF({ ...f, diagnosis: e.target.value })} className="mt-1.5" /></div>
      <div className="sm:col-span-2"><Label>Treatment</Label><Textarea rows={2} value={f.treatment} onChange={(e) => setF({ ...f, treatment: e.target.value })} className="mt-1.5" /></div>
      <TextField label="Follow-up date" type="date" value={f.follow_up_at} onChange={(v) => setF({ ...f, follow_up_at: v })} />
      <div className="sm:col-span-2"><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="mt-1.5" /></div>
      <div><Label>Prescription</Label><Input type="file" accept="image/*,.pdf" className="mt-1.5" onChange={(e) => setRx(e.target.files?.[0] ?? null)} /></div>
      <div><Label>Invoice</Label><Input type="file" accept="image/*,.pdf" className="mt-1.5" onChange={(e) => setInv(e.target.files?.[0] ?? null)} /></div>
    </FormCard>
  );
}

/* -------- Allergies -------- */
interface Alg { id: string; allergen: string; allergen_type: string; severity: string; symptoms: string | null; emergency_notes: string | null; }
function AllergiesTab({ pet }: { pet: Pet }) {
  const [items, setItems] = useState<Alg[] | null>(null);
  const [adding, setAdding] = useState(false);
  async function load() {
    const { data } = await supabase.from("pet_allergies").select("*").eq("pet_id", pet.id).order("created_at", { ascending: false });
    setItems((data as Alg[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [pet.id]);
  return (
    <ManagerShell title="Allergies" addLabel="Add allergy" onAdd={() => setAdding(true)} empty={items?.length === 0} emptyLabel="No allergies logged." loading={items === null}>
      {adding && <AlgForm pet={pet} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />}
      <ul className="space-y-3">
        {items?.map((a) => (
          <li key={a.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <TriangleAlert className={"size-4 " + (a.severity === "severe" ? "text-destructive" : "text-amber-600")} />
                  <span className="font-medium">{a.allergen}</span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs">{a.allergen_type}</span>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs">{a.severity}</span>
                </div>
                {a.symptoms && <p className="mt-2 text-sm text-muted-foreground">Symptoms: {a.symptoms}</p>}
                {a.emergency_notes && <p className="mt-1 text-sm text-destructive">Emergency: {a.emergency_notes}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={async () => { await supabase.from("pet_allergies").delete().eq("id", a.id); load(); }}><Trash2 className="size-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </ManagerShell>
  );
}
function AlgForm({ pet, onDone, onCancel }: { pet: Pet; onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ allergen: "", allergen_type: "food", severity: "mild", symptoms: "", emergency_notes: "" });
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!f.allergen.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("pet_allergies").insert({
      user_id: pet.user_id, pet_id: pet.id,
      allergen: f.allergen.trim(), allergen_type: f.allergen_type, severity: f.severity,
      symptoms: f.symptoms || null, emergency_notes: f.emergency_notes || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Allergy added"); onDone();
  }
  return (
    <FormCard onSave={save} onCancel={onCancel} busy={busy}>
      <TextField label="Allergen *" value={f.allergen} onChange={(v) => setF({ ...f, allergen: v })} />
      <SelectField label="Type" value={f.allergen_type} onChange={(v) => setF({ ...f, allergen_type: v })} options={[["food","Food"],["medicine","Medicine"],["environmental","Environmental"]]} />
      <SelectField label="Severity" value={f.severity} onChange={(v) => setF({ ...f, severity: v })} options={[["mild","Mild"],["moderate","Moderate"],["severe","Severe"]]} />
      <div className="sm:col-span-2"><Label>Symptoms</Label><Textarea rows={2} value={f.symptoms} onChange={(e) => setF({ ...f, symptoms: e.target.value })} className="mt-1.5" /></div>
      <div className="sm:col-span-2"><Label>Emergency notes</Label><Textarea rows={2} value={f.emergency_notes} onChange={(e) => setF({ ...f, emergency_notes: e.target.value })} className="mt-1.5" /></div>
    </FormCard>
  );
}

/* -------- Shared -------- */
function TextField({ label, value, onChange, type = "text", error, max }: { label: string; value: string; onChange: (v: string) => void; type?: string; error?: string; max?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} maxLength={max} aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div>
      <Label>{label}</Label>
      <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
function ManagerShell({ title, addLabel, onAdd, empty, emptyLabel, loading, children }: { title: string; addLabel: string; onAdd: () => void; empty?: boolean; emptyLabel: string; loading: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <Button onClick={onAdd} size="sm" className="rounded-full"><Plus className="mr-1 size-4" />{addLabel}</Button>
      </div>
      {loading ? <Skeleton /> : empty ? <Empty label={emptyLabel} /> : children}
    </div>
  );
}
function FormCard({ children, onSave, onCancel, busy }: { children: React.ReactNode; onSave: () => void; onCancel: () => void; busy: boolean }) {
  return (
    <div className="mb-4 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
      {children}
      <div className="sm:col-span-2 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} disabled={busy} className="rounded-full">{busy ? "Saving…" : "Save"}</Button>
      </div>
    </div>
  );
}
function FileButton({ path, label }: { path: string; label: string }) {
  return (
    <Button variant="outline" size="sm" onClick={async () => {
      const url = await signedPetFileUrl(path);
      if (url) window.open(url, "_blank", "noopener,noreferrer"); else toast.error("Could not open file");
    }}><Download className="mr-1 size-3.5" />{label}</Button>
  );
}
function Skeleton() { return <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading…</div>; }
function Empty({ label }: { label: string }) { return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{label}</div>; }
function fmtDate(s: string) { try { return new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); } catch { return s; } }
function calcAge(b: string | null) {
  if (!b) return null;
  const bd = new Date(b), now = new Date();
  const months = (now.getFullYear() - bd.getFullYear()) * 12 + (now.getMonth() - bd.getMonth());
  if (months < 12) return `${Math.max(months, 0)} mo`;
  const y = Math.floor(months / 12), m = months % 12;
  return m ? `${y}y ${m}mo` : `${y}y`;
}
function prettyKind(k: string) { return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
function kindIcon(k: string) {
  const cls = "size-3";
  if (k === "vaccination") return <Syringe className={cls} />;
  if (k === "medicine") return <Pill className={cls} />;
  if (k === "vet_visit") return <Stethoscope className={cls} />;
  if (k === "weight") return <Scale className={cls} />;
  if (k === "birthday" || k === "adoption") return <Cake className={cls} />;
  return <Calendar className={cls} />;
}

// Preserve import so tree-shaking keeps icons used in child components
export const _unused = { ChevronRight, Upload };
