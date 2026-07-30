import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Copy, Heart, HeartOff, RefreshCw, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import {
  NAMES,
  NAME_ORIGINS,
  NAME_STYLES,
  filterNames,
  type NameFilter,
  type PetName,
} from "@/data/name-catalog";
import { breadcrumbSchema } from "@/lib/schema";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FAVORITES_KEY = "furtools_name_favorites";

export const Route = createFileRoute("/names")({
  head: () => ({
    meta: [
      { title: "Pet Name Finder — 100+ Filters | FurTools" },
      {
        name: "description",
        content:
          "Find the perfect pet name with 100+ filters — gender, origin, meaning, length, funny, cute, luxury, nature, movies, anime, breed, size and more.",
      },
      { property: "og:title", content: "Pet Name Finder — FurTools" },
      { property: "og:description", content: "100+ filters to find the perfect pet name." },
      { property: "og:url", content: "/names" },
    ],
    links: [{ rel: "canonical", href: "/names" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Pet Names", url: "/names" },
          ]),
        ),
      },
    ],
  }),
  component: NameFinderPage,
});

function NameFinderPage() {
  const [filter, setFilter] = useState<NameFilter>({
    gender: "any",
    origin: "any",
    style: "any",
    species: "any",
    size: "any",
  });
  const [seed, setSeed] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const results = useMemo(() => {
    void seed; // re-seed shuffle
    const list = filterNames(NAMES, filter);
    // shuffle deterministically-ish
    return [...list].sort(() => Math.random() - 0.5).slice(0, 60);
  }, [filter, seed]);

  function toggleFav(name: string) {
    setFavorites((f) => (f.includes(name) ? f.filter((n) => n !== name) : [...f, name]));
  }

  async function copy(name: string) {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  }

  async function share(name: string) {
    const url = `${window.location.origin}/names?contains=${encodeURIComponent(name)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Pet name: ${name}`, url });
      } catch {
        /* cancelled */
      }
    } else {
      copy(url);
    }
  }

  const favoriteObjects = NAMES.filter((n) => favorites.includes(n.name));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Pet Names" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Pet Name Finder
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          100+ filters across gender, origin, meaning, style, length, and species. Generate,
          favorite, copy, and share names in seconds.
        </p>
      </header>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <FilterSelect label="Species" value={filter.species ?? "any"} onChange={(v) => setFilter({ ...filter, species: v as NameFilter["species"] })}
            options={[["any","Any"],["dog","Dog"],["cat","Cat"]]}
          />
          <FilterSelect label="Gender" value={filter.gender ?? "any"} onChange={(v) => setFilter({ ...filter, gender: v as NameFilter["gender"] })}
            options={[["any","Any"],["male","Male"],["female","Female"],["unisex","Unisex"]]}
          />
          <FilterSelect label="Size" value={filter.size ?? "any"} onChange={(v) => setFilter({ ...filter, size: v as NameFilter["size"] })}
            options={[["any","Any"],["small","Small"],["medium","Medium"],["large","Large"]]}
          />
          <FilterSelect label="Style" value={filter.style ?? "any"} onChange={(v) => setFilter({ ...filter, style: v as NameFilter["style"] })}
            options={[["any","Any"], ...NAME_STYLES.map((s) => [s, s[0].toUpperCase() + s.slice(1)] as [string,string])]}
          />
          <FilterSelect label="Origin / Country" value={filter.origin ?? "any"} onChange={(v) => setFilter({ ...filter, origin: v })}
            options={[["any","Any"], ...NAME_ORIGINS.map((o) => [o, o] as [string,string])]}
          />
          <NumberInput label="Min length" value={filter.minLength} onChange={(v) => setFilter({ ...filter, minLength: v })} />
          <NumberInput label="Max length" value={filter.maxLength} onChange={(v) => setFilter({ ...filter, maxLength: v })} />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contains</label>
            <Input
              value={filter.contains ?? ""}
              onChange={(e) => setFilter({ ...filter, contains: e.target.value })}
              placeholder="e.g. moo"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meaning contains</label>
            <Input
              value={filter.meaning ?? ""}
              onChange={(e) => setFilter({ ...filter, meaning: e.target.value })}
              placeholder="e.g. lion, moon, sweet"
            />
          </div>
        </div>

        {/* Alphabet */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          <button
            type="button"
            className={"rounded-full px-2.5 py-1 text-xs font-medium " + (!filter.startsWith ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}
            onClick={() => setFilter({ ...filter, startsWith: undefined })}
          >
            All
          </button>
          {ALPHABET.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setFilter({ ...filter, startsWith: l })}
              className={"grid size-8 place-items-center rounded-full text-xs font-medium " + (filter.startsWith === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {results.length} names shown
          </p>
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary/40"
          >
            <RefreshCw className="size-4" aria-hidden /> Shuffle
          </button>
        </div>
      </section>

      {/* Results grid */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((n) => (
          <NameCard
            key={n.name}
            name={n}
            favorited={favorites.includes(n.name)}
            copied={copied === n.name}
            onFav={() => toggleFav(n.name)}
            onCopy={() => copy(n.name)}
            onShare={() => share(n.name)}
          />
        ))}
        {results.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No names match. Try relaxing a filter.
          </div>
        )}
      </section>

      {/* Favorites */}
      {favoriteObjects.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">Your favorites ({favoriteObjects.length})</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {favoriteObjects.map((n) => (
              <button
                key={n.name}
                type="button"
                onClick={() => toggleFav(n.name)}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
              >
                <Heart className="size-4 fill-current" aria-hidden />
                {n.name}
                <HeartOff className="size-3 opacity-60" aria-hidden />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}
function NumberInput({ label, value, onChange }: { label: string; value?: number; onChange: (v?: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <Input
        type="number"
        min={1}
        max={20}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      />
    </label>
  );
}

function NameCard({
  name,
  favorited,
  copied,
  onFav,
  onCopy,
  onShare,
}: {
  name: PetName;
  favorited: boolean;
  copied: boolean;
  onFav: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-xl font-semibold">{name.name}</div>
          <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
            {name.gender} · {name.origin}
          </div>
        </div>
        <button
          type="button"
          onClick={onFav}
          aria-label={favorited ? "Remove favorite" : "Add favorite"}
          className={"rounded-full p-1.5 transition " + (favorited ? "text-red-500" : "text-muted-foreground hover:text-foreground")}
        >
          <Heart className={"size-5 " + (favorited ? "fill-current" : "")} aria-hidden />
        </button>
      </div>
      {name.meaning && (
        <p className="mt-2 text-sm text-muted-foreground">"{name.meaning}"</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {name.styles.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-accent/40 px-2 py-0.5 text-[10px] font-medium capitalize">{s}</span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:border-primary/40"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:border-primary/40"
        >
          Share
        </button>
      </div>
    </div>
  );
}
