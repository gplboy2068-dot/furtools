import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  Activity,
  BookOpen,
  Brush,
  Dog,
  Heart,
  Home,
  Ruler,
  Scale,
  Sparkles,
  Timer,
  Utensils,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";
import {
  breedDetailQuery,
  formatRange,
  levelBadge,
  type BreedRow,
} from "@/lib/breeds";
import { getSpecies } from "@/data/species";
import { getTool } from "@/data/tools";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/breeds/$slug")({
  loader: async ({ params, context }) => {
    const breed = await context.queryClient.ensureQueryData(breedDetailQuery(params.slug));
    if (!breed) throw notFound();
    return breed;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Breed not found — FurTools" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const b = loaderData;
    const title = `${b.name} — Breed Profile | FurTools`;
    const description =
      b.overview.length > 155 ? b.overview.slice(0, 152) + "…" : b.overview;
    const url = `/breeds/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(b.hero_image ? [{ property: "og:image", content: b.hero_image }] : []),
        ...(b.hero_image ? [{ name: "twitter:image", content: b.hero_image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${b.name} Breed Profile`,
            description,
            url,
            image: b.hero_image ?? undefined,
            author: { "@type": "Organization", name: SITE.name },
            about: {
              "@type": "Thing",
              name: b.name,
              additionalType: b.species === "dog" ? "Dog breed" : "Cat breed",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Breeds", url: "/breeds" },
              {
                name: getSpecies(b.species)?.plural ?? b.species,
                url: `/breeds?species=${b.species}`,
              },
              { name: b.name, url },
            ]),
          ),
        },
        ...(b.faqs.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify(
                  faqSchema(b.faqs.map((f) => ({ q: f.question, a: f.answer }))),
                ),
              },
            ]
          : []),
      ],
    };
  },
  component: BreedPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Breed not found</h1>
      <p className="mt-3 text-muted-foreground">
        We haven’t published this breed yet. Browse the{" "}
        <Link to="/breeds" className="text-primary underline">breed database</Link>.
      </p>
    </div>
  ),
});

import { useLocalizedRecord } from "@/lib/i18n-db";

function BreedPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-14"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div>}>
      <BreedBody />
    </Suspense>
  );
}

function BreedBody() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(breedDetailQuery(slug));
  const breed = (useLocalizedRecord(data) || data) as BreedRow;
  const species = getSpecies(breed.species);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Breeds", to: "/breeds" },
          { label: species?.plural ?? breed.species },
          { label: breed.name },
        ]}
      />

      {/* Hero */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid md:grid-cols-2">
          <div className="p-6 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {species?.singular ?? breed.species} Breed
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {breed.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{breed.overview}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {breed.temperament_traits.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-accent/40 px-3 py-1 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 md:min-h-[360px]">
            {breed.hero_image ? (
              <img
                src={breed.hero_image}
                alt={breed.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-10 text-center">
                <div>
                  <Dog className="mx-auto size-16 text-primary/60" aria-hidden />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Photo coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Scale className="size-5" />}
          label="Weight"
          value={formatRange(breed.weight_min, breed.weight_max, breed.weight_unit)}
        />
        <Stat
          icon={<Ruler className="size-5" />}
          label="Height"
          value={formatRange(breed.height_min, breed.height_max, breed.height_unit)}
        />
        <Stat
          icon={<Heart className="size-5" />}
          label="Lifespan"
          value={
            breed.lifespan_min && breed.lifespan_max
              ? `${breed.lifespan_min}–${breed.lifespan_max} yrs`
              : "—"
          }
        />
        <Stat
          icon={<Activity className="size-5" />}
          label="Exercise"
          value={
            breed.exercise_minutes_per_day
              ? `${breed.exercise_minutes_per_day} min/day`
              : levelBadge(breed.exercise_level).label
          }
        />
      </section>

      {/* Traits */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TraitPill label="Energy" value={breed.energy_level} />
        <TraitPill label="Shedding" value={breed.shedding_level} />
        <TraitPill label="Trainability" value={breed.trainability} />
        <TraitPill label="Size" value={breed.size_category} />
      </section>

      {/* Overview / History */}
      {breed.history && (
        <Section title="History & Origin" icon={<BookOpen className="size-5" />}>
          <p>{breed.history}</p>
          {breed.origin_country && (
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>Country of origin:</strong> {breed.origin_country}
              {breed.breed_group && <> · <strong>Breed group:</strong> {breed.breed_group}</>}
            </p>
          )}
        </Section>
      )}

      {/* Temperament */}
      {breed.temperament_description && (
        <Section title="Temperament" icon={<Sparkles className="size-5" />}>
          <p>{breed.temperament_description}</p>
          {Object.keys(breed.good_with).length > 0 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {Object.entries(breed.good_with).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="capitalize text-muted-foreground">
                    {k.replace(/_/g, " ")}
                  </span>
                  <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + levelBadge(v).className}>
                    {levelBadge(v).label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Exercise */}
      {breed.exercise_description && (
        <Section title="Exercise Needs" icon={<Activity className="size-5" />}>
          <p>{breed.exercise_description}</p>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-4">
            <Timer className="size-5 text-primary" aria-hidden />
            <div>
              <div className="text-sm text-muted-foreground">Recommended daily</div>
              <div className="font-medium">
                {breed.exercise_minutes_per_day
                  ? `${breed.exercise_minutes_per_day} minutes`
                  : levelBadge(breed.exercise_level).label + " activity"}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Weight / Height / Lifespan detail block */}
      <Section title="Size & Lifespan" icon={<Scale className="size-5" />}>
        <div className="grid gap-4 sm:grid-cols-3">
          <DetailCell label="Weight">
            {formatRange(breed.weight_min, breed.weight_max, breed.weight_unit)}
          </DetailCell>
          <DetailCell label="Height">
            {formatRange(breed.height_min, breed.height_max, breed.height_unit)}
          </DetailCell>
          <DetailCell label="Lifespan">
            {breed.lifespan_min && breed.lifespan_max
              ? `${breed.lifespan_min}–${breed.lifespan_max} years`
              : "—"}
          </DetailCell>
        </div>
      </Section>

      {/* Common diseases */}
      {breed.common_diseases.length > 0 && (
        <Section title="Common Health Issues" icon={<Heart className="size-5" />}>
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-sm dark:bg-amber-950/20">
            <strong>Not medical advice.</strong> This is a general summary of conditions
            more common in the breed. Always consult your veterinarian.
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {breed.common_diseases.map((d) => (
              <li
                key={d.name}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="font-medium">{d.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Nutrition */}
      {breed.nutrition && (
        <Section title="Nutrition" icon={<Utensils className="size-5" />}>
          <p>{breed.nutrition}</p>
        </Section>
      )}

      {/* Grooming */}
      {breed.grooming && (
        <Section title="Grooming" icon={<Brush className="size-5" />}>
          <p>{breed.grooming}</p>
          {breed.grooming_frequency && (
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>Frequency:</strong> {breed.grooming_frequency}
            </p>
          )}
          {breed.coat_type && (
            <p className="mt-1 text-sm text-muted-foreground">
              <strong>Coat:</strong> {breed.coat_type}
            </p>
          )}
          {breed.coat_colors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {breed.coat_colors.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-accent/40 px-2.5 py-1 text-xs"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Additional images */}
      {breed.images.length > 0 && (
        <Section title="Gallery" icon={<Home className="size-5" />}>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {breed.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${breed.name} photo ${i + 1}`}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Related tools */}
      {breed.related_tool_slugs.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">Tools for {breed.name} parents</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {breed.related_tool_slugs
              .map((s) => getTool(s))
              .filter((t): t is NonNullable<ReturnType<typeof getTool>> => Boolean(t))
              .map((t) => (
                <Link
                  key={t.slug}
                  to="/tools/$slug"
                  params={{ slug: t.slug }}
                  className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="font-medium group-hover:text-primary">{t.name}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.tagline}</p>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Related articles */}
      {breed.related_article_slugs.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">Related reading</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {breed.related_article_slugs.map((slug) => (
              <li key={slug}>
                <a
                  href={`/blog/${slug}`}
                  className="flex h-full gap-3 rounded-xl border border-border/60 bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
                >
                  <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm font-medium capitalize">
                    {slug.replace(/-/g, " ")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {breed.faqs.length > 0 && (
        <div className="mt-16">
          <Faq
            items={breed.faqs.map((f) => ({ q: f.question, a: f.answer }))}
          />
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h2>
      <div className="prose prose-neutral mt-4 max-w-none dark:prose-invert">{children}</div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-2 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}

function TraitPill({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  const b = levelBadge(value);
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + b.className}>
        {b.label}
      </span>
    </div>
  );
}

function DetailCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/40 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{children}</div>
    </div>
  );
}
