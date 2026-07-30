import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { Search, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import {
  foodsListQuery,
  FOOD_CATEGORIES,
  FOOD_SPECIES,
  safetyMeta,
  type FoodRow,
  type SafetyLevel,
} from "@/lib/foods";
import { breadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/foods/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(foodsListQuery),
  head: () => ({
    meta: [
      { title: "Can My Pet Eat This? — Food Safety Database | FurTools" },
      {
        name: "description",
        content:
          "Search 500+ human foods to see if they're safe for dogs and cats. Benefits, risks, symptoms, vet advice, and safer alternatives — all in one place.",
      },
      { property: "og:title", content: "Can My Pet Eat This? — FurTools" },
      { property: "og:description", content: "Food safety database for dogs and cats." },
      { property: "og:url", content: "/foods" },
    ],
    links: [{ rel: "canonical", href: "/foods" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Foods", url: "/foods" },
          ]),
        ),
      },
    ],
  }),
  component: FoodsIndex,
});

function FoodsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Foods" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Can my pet eat this?
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
  Search 500+ human foods to see if they're safe for dogs, cats, rabbits, birds, hamsters, guinea pigs, ferrets, horses, turtles and fish. Benefits, risks, symptoms, vet advice, and safer alternatives.
        </p>
      </header>
      <Suspense fallback={<GridSkeleton />}>
        <FoodsContent />
      </Suspense>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function FoodsContent() {
  const { data } = useSuspenseQuery(foodsListQuery);
  const [species, setSpecies] = useState<string>("dog");
  const [category, setCategory] = useState<string>("all");
  const [safety, setSafety] = useState<"all" | SafetyLevel>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((f) => {
      const s = (f.species_safety[species] ?? "unknown") as SafetyLevel;
      if (category !== "all" && f.category !== category) return false;
      if (safety !== "all" && s !== safety) return false;
      if (
        q &&
        !f.name.toLowerCase().includes(q) &&
        !f.keywords.some((k) => k.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [data, species, category, safety, query]);

  const counts = useMemo(() => {
    const c = { safe: 0, moderation: 0, unsafe: 0 };
    for (const f of data) {
      const s = (f.species_safety[species] ?? "unknown") as SafetyLevel;
      if (s === "safe") c.safe++;
      else if (s === "moderation") c.moderation++;
      else if (s === "unsafe") c.unsafe++;
    }
    return c;
  }, [data, species]);

  return (
    <div className="mt-8">
      {/* Species chips */}
      <div className="flex flex-wrap gap-2">
        {FOOD_SPECIES.map((s) => {
          const active = species === s.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSpecies(s.slug)}
              className={
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition " +
                (active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
              }
              aria-pressed={active}
            >
              <span aria-hidden>{s.emoji}</span>
              {s.plural}
            </button>
          );
        })}
      </div>

      {/* Counters */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <CountCard color="emerald" icon={<ShieldCheck className="size-5" />} label="Safe" value={counts.safe} onClick={() => setSafety("safe")} />
        <CountCard color="amber" icon={<AlertTriangle className="size-5" />} label="In moderation" value={counts.moderation} onClick={() => setSafety("moderation")} />
        <CountCard color="red" icon={<ShieldAlert className="size-5" />} label="Unsafe" value={counts.unsafe} onClick={() => setSafety("unsafe")} />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods (e.g. chocolate, apple, chicken)"
            className="pl-9"
            aria-label="Search foods"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Category filter"
        >
          <option value="all">All categories</option>
          {FOOD_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
        <select
          value={safety}
          onChange={(e) => setSafety(e.target.value as "all" | SafetyLevel)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Safety filter"
        >
          <option value="all">All safety levels</option>
          <option value="safe">Safe</option>
          <option value="moderation">In moderation</option>
          <option value="unsafe">Unsafe</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No foods match your filters.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <FoodCard key={f.id} food={f} species={species} />
          ))}
        </div>
      )}
    </div>
  );
}

function CountCard({
  color,
  icon,
  label,
  value,
  onClick,
}: {
  color: "emerald" | "amber" | "red";
  icon: React.ReactNode;
  label: string;
  value: number;
  onClick: () => void;
}) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    red: "bg-red-500/10 text-red-700 dark:text-red-300",
  }[color];
  return (
    <button
      type="button"
      onClick={onClick}
      className={"flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40 " + colorMap}
    >
      <span className="grid size-10 place-items-center rounded-full bg-background/60">{icon}</span>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide">{label}</div>
        <div className="font-display text-xl font-semibold">{value}</div>
      </div>
    </button>
  );
}

function FoodCard({ food, species }: { food: FoodRow; species: string }) {
  const level = (food.species_safety[species] ?? "unknown") as SafetyLevel;
  const meta = safetyMeta(level);
  return (
    <Link
      to="/foods/$slug"
      params={{ slug: food.slug }}
      className={"group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:shadow-sm ring-1 " + meta.ring}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-lg font-semibold group-hover:text-primary">{food.name}</h2>
        <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + meta.bg + " " + meta.color}>
          {meta.label}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{food.short_answer}</p>
    </Link>
  );
}
