import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breedsListQuery, type BreedRow } from "@/lib/breeds";
import { SPECIES, type Species } from "@/data/species";
import { breadcrumbSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/breeds/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(breedsListQuery),
  head: () => ({
    meta: [
      { title: "Breed Database — Dogs, Cats & More | FurTools" },
      {
        name: "description",
        content:
          "Browse in-depth breed profiles for dogs, cats and more. Temperament, exercise, weight, lifespan, health issues, nutrition, and grooming — all in one place.",
      },
      { property: "og:title", content: "Breed Database — FurTools" },
      {
        property: "og:description",
        content: "In-depth breed profiles for dogs, cats and more.",
      },
      { property: "og:url", content: "/breeds" },
    ],
    links: [{ rel: "canonical", href: "/breeds" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Breeds", url: "/breeds" },
          ]),
        ),
      },
    ],
  }),
  component: BreedsIndex,
});

function BreedsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Breeds" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          The Breed Database
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Deep, plain-language breed profiles — temperament, exercise needs, weight, lifespan,
          health issues, nutrition, grooming, and the tools to care for each one.
        </p>
      </header>

      <Suspense fallback={<GridSkeleton />}>
        <BreedsContent />
      </Suspense>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function BreedsContent() {
  const { data: breeds } = useSuspenseQuery(breedsListQuery);
  const [activeSpecies, setActiveSpecies] = useState<Species["slug"]>("dog");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of breeds) c[b.species] = (c[b.species] ?? 0) + 1;
    return c;
  }, [breeds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return breeds
      .filter((b) => b.species === activeSpecies)
      .filter((b) => (q ? b.name.toLowerCase().includes(q) || b.overview.toLowerCase().includes(q) : true));
  }, [breeds, activeSpecies, query]);

  const activeMeta = SPECIES.find((s) => s.slug === activeSpecies)!;

  return (
    <div className="mt-10">
      {/* Species tabs */}
      <div className="flex flex-wrap gap-2">
        {SPECIES.map((s) => {
          const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[s.icon] ??
            LucideIcons.PawPrint;
          const isActive = activeSpecies === s.slug;
          const count = counts[s.slug] ?? 0;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => s.live && setActiveSpecies(s.slug)}
              disabled={!s.live}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40",
                !s.live && "cursor-not-allowed opacity-60",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isActive}
            >
              <Icon className="size-4" aria-hidden />
              <span>{s.plural}</span>
              {s.live ? (
                <span className={isActive ? "text-primary-foreground/80" : "text-muted-foreground"}>
                  · {count}
                </span>
              ) : (
                <span className="text-xs uppercase tracking-wider">Soon</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{activeMeta.description}</p>

      {/* Search */}
      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${activeMeta.plural.toLowerCase()} breeds…`}
          className="pl-9"
          aria-label="Search breeds"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No breeds match your search yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BreedCard key={b.id} breed={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BreedCard({ breed }: { breed: BreedRow }) {
  return (
    <Link
      to="/breeds/$slug"
      params={{ slug: breed.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-sm"
    >
      {breed.hero_image ? (
        <img
          src={breed.hero_image}
          alt={breed.name}
          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/20" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-xl font-semibold leading-snug group-hover:text-primary">
          {breed.name}
        </h2>
        <p className="line-clamp-3 text-sm text-muted-foreground">{breed.overview}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-3">
          {breed.temperament_traits.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-accent/40 px-2 py-0.5 text-[11px] font-medium text-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
