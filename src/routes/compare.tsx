import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Suspense } from "react";
import { ArrowRightLeft, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { breedsListQuery, type BreedRow, formatRange, levelBadge } from "@/lib/breeds";
import { breadcrumbSchema } from "@/lib/schema";

const search = z.object({
  a: fallback(z.string(), "golden-retriever").default("golden-retriever"),
  b: fallback(z.string(), "labrador-retriever").default("labrador-retriever"),
});

export const Route = createFileRoute("/compare")({
  validateSearch: zodValidator(search),
  loaderDeps: ({ search }) => ({ a: search.a, b: search.b }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(breedsListQuery);
    return { a: deps.a, b: deps.b };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.a ?? "golden-retriever";
    const b = loaderData?.b ?? "labrador-retriever";
    const title = `Compare ${titleize(a)} vs ${titleize(b)} | FurTools`;
    const description = `Side-by-side comparison of ${titleize(a)} and ${titleize(b)} — weight, height, temperament, energy, lifespan, exercise, health, and more.`;
    const url = `/compare?a=${a}&b=${b}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Breeds", url: "/breeds" },
              { name: "Compare", url: "/compare" },
              { name: `${titleize(a)} vs ${titleize(b)}`, url },
            ]),
          ),
        },
      ],
    };
  },
  component: ComparePage,
});

function titleize(slug: string) {
  return slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}

function ComparePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-14"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div>}>
      <CompareBody />
    </Suspense>
  );
}

function CompareBody() {
  const { data: all } = useSuspenseQuery(breedsListQuery);
  const { a, b } = Route.useSearch();
  const navigate = useNavigate({ from: "/compare" });
  const [copied, setCopied] = useState(false);

  const breedA = all.find((x) => x.slug === a) ?? all[0];
  const breedB = all.find((x) => x.slug === b) ?? all[1];

  function setSide(side: "a" | "b", slug: string) {
    navigate({ search: (prev: { a: string; b: string }) => ({ ...prev, [side]: slug }) });
  }
  function swap() {
    navigate({ search: () => ({ a: b, b: a }) });
  }
  async function copyLink() {
    const url = `${window.location.origin}/compare?a=${breedA.slug}&b=${breedB.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Breeds", to: "/breeds" }, { label: "Compare" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {breedA.name} vs {breedB.name}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Side-by-side comparison of weight, height, temperament, energy, lifespan, exercise,
          trainability, and more. Change either breed or share the link.
        </p>
      </header>

      {/* Selectors */}
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <BreedPicker label="Breed A" value={breedA.slug} onChange={(v) => setSide("a", v)} options={all} />
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={swap}
            className="grid size-11 place-items-center rounded-full border border-border bg-card transition hover:border-primary/40"
            aria-label="Swap breeds"
          >
            <ArrowRightLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-primary/40"
          >
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? "Copied" : "Share"}
          </button>
        </div>
        <BreedPicker label="Breed B" value={breedB.slug} onChange={(v) => setSide("b", v)} options={all} />
      </div>

      {/* Comparison table */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[minmax(120px,180px)_1fr_1fr] divide-y divide-border">
          <BreedHeader breed={breedA} align="left" />
          <BreedHeaderCell breed={breedA} />
          <BreedHeaderCell breed={breedB} />

          <Row title="Weight">
            <Cell>{formatRange(breedA.weight_min, breedA.weight_max, breedA.weight_unit)}</Cell>
            <Cell>{formatRange(breedB.weight_min, breedB.weight_max, breedB.weight_unit)}</Cell>
          </Row>
          <Row title="Height">
            <Cell>{formatRange(breedA.height_min, breedA.height_max, breedA.height_unit)}</Cell>
            <Cell>{formatRange(breedB.height_min, breedB.height_max, breedB.height_unit)}</Cell>
          </Row>
          <Row title="Lifespan">
            <Cell>{breedA.lifespan_min}–{breedA.lifespan_max} years</Cell>
            <Cell>{breedB.lifespan_min}–{breedB.lifespan_max} years</Cell>
          </Row>
          <Row title="Energy">
            <BadgeCell level={breedA.energy_level} />
            <BadgeCell level={breedB.energy_level} />
          </Row>
          <Row title="Trainability">
            <BadgeCell level={breedA.trainability} />
            <BadgeCell level={breedB.trainability} />
          </Row>
          <Row title="Exercise">
            <Cell>{breedA.exercise_minutes_per_day ? `${breedA.exercise_minutes_per_day} min/day` : "—"}</Cell>
            <Cell>{breedB.exercise_minutes_per_day ? `${breedB.exercise_minutes_per_day} min/day` : "—"}</Cell>
          </Row>
          <Row title="Shedding">
            <BadgeCell level={breedA.shedding_level} />
            <BadgeCell level={breedB.shedding_level} />
          </Row>
          <Row title="Temperament">
            <Cell>
              <div className="flex flex-wrap gap-1">
                {breedA.temperament_traits.map((t) => (
                  <span key={t} className="rounded-full bg-accent/40 px-2 py-0.5 text-xs">{t}</span>
                ))}
              </div>
            </Cell>
            <Cell>
              <div className="flex flex-wrap gap-1">
                {breedB.temperament_traits.map((t) => (
                  <span key={t} className="rounded-full bg-accent/40 px-2 py-0.5 text-xs">{t}</span>
                ))}
              </div>
            </Cell>
          </Row>
          <Row title="Children">
            <BadgeCell level={breedA.good_with.children} />
            <BadgeCell level={breedB.good_with.children} />
          </Row>
          <Row title="Family friendly">
            <BadgeCell level={breedA.good_with.other_pets} />
            <BadgeCell level={breedB.good_with.other_pets} />
          </Row>
          <Row title="Apartment">
            <BadgeCell level={breedA.good_with.apartments} />
            <BadgeCell level={breedB.good_with.apartments} />
          </Row>
          <Row title="First-time owners">
            <BadgeCell level={breedA.good_with.first_time_owners} />
            <BadgeCell level={breedB.good_with.first_time_owners} />
          </Row>
          <Row title="Climate">
            <Cell>{climateFromCoat(breedA)}</Cell>
            <Cell>{climateFromCoat(breedB)}</Cell>
          </Row>
          <Row title="Est. lifetime cost">
            <Cell>{costEstimate(breedA)}</Cell>
            <Cell>{costEstimate(breedB)}</Cell>
          </Row>
          <Row title="Nutrition">
            <Cell><span className="text-sm leading-relaxed text-muted-foreground">{breedA.nutrition || "—"}</span></Cell>
            <Cell><span className="text-sm leading-relaxed text-muted-foreground">{breedB.nutrition || "—"}</span></Cell>
          </Row>
          <Row title="Health risks">
            <Cell>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {breedA.common_diseases.map((d) => <li key={d.name}>{d.name}</li>)}
              </ul>
            </Cell>
            <Cell>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {breedB.common_diseases.map((d) => <li key={d.name}>{d.name}</li>)}
              </ul>
            </Cell>
          </Row>
        </div>
      </div>
    </div>
  );
}

function BreedPicker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: BreedRow[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-input bg-background px-3 py-2.5 text-base"
      >
        {options.map((b) => (
          <option key={b.slug} value={b.slug}>
            {b.name} ({b.species})
          </option>
        ))}
      </select>
    </label>
  );
}

function BreedHeader({ align }: { breed: BreedRow; align: "left" | "right" }) {
  return (
    <div className={"bg-muted/40 p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground " + (align === "right" ? "text-right" : "")}>
      Attribute
    </div>
  );
}
function BreedHeaderCell({ breed }: { breed: BreedRow }) {
  return (
    <div className="bg-muted/40 p-4">
      <div className="font-display text-lg font-semibold">{breed.name}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{breed.species}</div>
    </div>
  );
}
function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="border-t border-border bg-muted/20 p-4 text-sm font-medium">{title}</div>
      {children}
    </>
  );
}
function Cell({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-border p-4">{children}</div>;
}
function BadgeCell({ level }: { level: string | null | undefined }) {
  if (!level) return <Cell>—</Cell>;
  const b = levelBadge(level);
  return (
    <div className="border-t border-border p-4">
      <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + b.className}>{b.label}</span>
    </div>
  );
}

function climateFromCoat(b: BreedRow) {
  const c = (b.coat_type ?? "").toLowerCase();
  if (c.includes("double") || c.includes("water-resistant")) return "Cold-tolerant; can overheat";
  if (c.includes("short") || c.includes("fine") || c.includes("smooth")) return "Warm-friendly; chills easily";
  if (c.includes("long") || c.includes("silky")) return "Prefers temperate climates";
  return "Adaptable";
}
function costEstimate(b: BreedRow) {
  const size = (b.size_category ?? "medium").toLowerCase();
  if (size.includes("extra")) return "$$$$ (~$25-35k)";
  if (size.includes("large")) return "$$$ (~$20-30k)";
  if (size.includes("small")) return "$$ (~$12-18k)";
  return "$$ (~$15-22k)";
}
