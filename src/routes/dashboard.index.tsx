import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Loader2, PawPrint, Plus, Syringe, Pill, Stethoscope, Scale, Calendar, LogOut } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signedPetFileUrl, uploadPetFile } from "@/lib/pet-uploads";
import { SPECIES_SELECT_OPTIONS } from "@/data/species-config";
import { getActiveUser, clearCustomSession, ActiveUser } from "@/lib/custom-google-auth";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "My Pets Dashboard — FurTools" },
      { name: "description", content: "Manage every pet's profile, health records, vaccinations, medications, weight and vet visits in one place." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DashboardIndex,
});

interface PetRow {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birthdate: string | null;
  weight: number | null;
  weight_unit: string;
  avatar_url: string | null;
  gender: string | null;
}

function DashboardIndex() {
  const [activeUser, setActiveUser] = useState<ActiveUser | null | undefined>(undefined);
  const navigate = useNavigate();

  const checkUser = async () => {
    const u = await getActiveUser();
    setActiveUser(u);
  };

  useEffect(() => {
    checkUser();
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      checkUser();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    clearCustomSession();
    await supabase.auth.signOut();
    setActiveUser(null);
    toast.success("Signed out successfully.");
    navigate({ to: "/auth" });
  };

  if (activeUser === undefined) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-5 animate-spin" /> Loading…</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "My Pets" }]} />
      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">My Pets Dashboard</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Profiles, vaccinations, medicines, weight, and vet visits — synced to {activeUser ? activeUser.name || activeUser.email : 'your account'}.
          </p>
        </div>
        {activeUser && (
          <div className="flex items-center gap-3">
            {activeUser.avatarUrl && (
              <img src={activeUser.avatarUrl} alt={activeUser.name} className="size-10 rounded-full border" />
            )}
            <div className="text-sm">
              <div className="font-semibold">{activeUser.name}</div>
              <div className="text-xs text-muted-foreground">{activeUser.email}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1 rounded-full text-xs">
              <LogOut className="size-3.5" /> Sign out
            </Button>
          </div>
        )}
      </header>
      {activeUser ? <PetsList userId={activeUser.id} /> : <SignedOut />}
    </div>
  );
}

function SignedOut() {
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
      <PawPrint className="mx-auto size-12 text-primary" />
      <h2 className="mt-4 font-display text-2xl font-semibold">Sign in to see your pets</h2>
      <p className="mt-2 text-muted-foreground">Create a free account or sign in to save profiles, health records, and reminders.</p>
      <Button asChild size="lg" className="mt-6"><Link to="/auth">Sign in or create an account</Link></Button>
    </div>
  );
}

function PetsList({ userId }: { userId: string }) {
  const [pets, setPets] = useState<PetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [avatars, setAvatars] = useState<Record<string, string>>({});

  async function refresh() {
    setLoading(true);
    const { data } = await supabase
      .from("pets")
      .select("id,name,species,breed,birthdate,weight,weight_unit,avatar_url,gender")
      .eq("user_id", userId)
      .order("created_at");
    const list = (data ?? []) as PetRow[];
    setPets(list);
    const urls: Record<string, string> = {};
    await Promise.all(
      list.map(async (p) => {
        if (p.avatar_url) {
          const u = await signedPetFileUrl(p.avatar_url);
          if (u) urls[p.id] = u;
        }
      }),
    );
    setAvatars(urls);
    setLoading(false);
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [userId]);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{pets.length} {pets.length === 1 ? "pet" : "pets"}</h2>
        <Button onClick={() => setShowAdd((s) => !s)} className="rounded-full">
          <Plus className="mr-1 size-4" /> {showAdd ? "Close" : "Add pet"}
        </Button>
      </div>
      {showAdd && <AddPetCard userId={userId} onDone={() => { setShowAdd(false); refresh(); }} />}
      {loading ? (
        <div className="mt-6 text-sm text-muted-foreground">Loading…</div>
      ) : pets.length === 0 && !showAdd ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
          <PawPrint className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No pets yet — add your first one to get started.</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((p) => <PetCard key={p.id} pet={p} avatarUrl={avatars[p.id]} />)}
        </ul>
      )}
    </section>
  );
}

function PetCard({ pet, avatarUrl }: { pet: PetRow; avatarUrl?: string }) {
  const age = calcAge(pet.birthdate);
  return (
    <li>
      <Link
        to="/dashboard/pets/$id"
        params={{ id: pet.id }}
        className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/60 hover:shadow-md"
      >
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pet.name} className="size-full object-cover" />
          ) : (
            <PawPrint className="size-16 text-primary/70" />
          )}
        </div>
        <div className="p-4">
          <div className="font-display text-lg font-semibold">{pet.name}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">
            {[pet.species, pet.breed, pet.gender].filter(Boolean).join(" · ")}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
            {age && <span className="rounded-full bg-accent px-2 py-0.5">{age}</span>}
            {pet.weight != null && <span className="rounded-full bg-accent px-2 py-0.5">{pet.weight} {pet.weight_unit}</span>}
          </div>
        </div>
      </Link>
    </li>
  );
}

function AddPetCard({ userId, onDone }: { userId: string; onDone: () => void }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    species: "dog",
    breed: "",
    gender: "",
    birthdate: "",
    weight: "",
    weight_unit: "lbs",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("pets")
        .insert({
          user_id: userId,
          name: form.name.trim(),
          species: form.species,
          breed: form.breed || null,
          gender: form.gender || null,
          birthdate: form.birthdate || null,
          weight: form.weight ? Number(form.weight) : null,
          weight_unit: form.weight_unit,
        })
        .select("id")
        .single();
      if (error) throw error;
      if (photo && data) {
        try {
          const path = await uploadPetFile(userId, data.id, "avatar", photo);
          await supabase.from("pets").update({ avatar_url: path }).eq("id", data.id);
        } catch (err) {
          toast.error("Pet saved, but photo upload failed");
          console.error(err);
        }
      }
      toast.success("Pet added");
      onDone();
      if (data) navigate({ to: "/dashboard/pets/$id", params: { id: data.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add pet");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-2 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label>Name *</Label>
        <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
      </div>
      <div>
        <Label>Species</Label>
        <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
          {SPECIES_SELECT_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div>
        <Label>Breed</Label>
        <Input value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="mt-1.5" />
      </div>
      <div>
        <Label>Gender</Label>
        <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="">—</option><option value="male">Male</option><option value="female">Female</option>
        </select>
      </div>
      <div>
        <Label>Birth date</Label>
        <Input type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} className="mt-1.5" />
      </div>
      <div className="grid grid-cols-[1fr_100px] gap-2">
        <div>
          <Label>Weight</Label>
          <Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Unit</Label>
          <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.weight_unit} onChange={(e) => setForm({ ...form, weight_unit: e.target.value })}>
            <option value="lbs">lbs</option><option value="kg">kg</option>
          </select>
        </div>
      </div>
      <div className="sm:col-span-2">
        <Label>Photo</Label>
        <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} className="mt-1.5" />
      </div>
      <div className="sm:col-span-2 flex justify-end gap-2">
        <Button type="submit" disabled={busy} className="rounded-full">
          {busy ? "Saving…" : "Save pet"}
        </Button>
      </div>
    </form>
  );
}

function calcAge(birthdate: string | null): string | null {
  if (!birthdate) return null;
  const b = new Date(birthdate); const now = new Date();
  const months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (months < 12) return `${Math.max(months, 0)} mo`;
  const y = Math.floor(months / 12); const m = months % 12;
  return m ? `${y}y ${m}mo` : `${y}y`;
}

export { Syringe, Pill, Stethoscope, Scale, Calendar };
