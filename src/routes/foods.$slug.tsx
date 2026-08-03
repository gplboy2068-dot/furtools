import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  AlertTriangle,
  BookOpen,
  Heart,
  Leaf,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";
import { foodDetailQuery, safetyMeta, FOOD_SPECIES, type SafetyLevel } from "@/lib/foods";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const Route = createFileRoute("/foods/$slug")({
  loader: async ({ params, context }) => {
    const food = await context.queryClient.ensureQueryData(foodDetailQuery(params.slug));
    if (!food) throw notFound();
    return food;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Food not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const f = loaderData;
    const title = `Can dogs and cats eat ${f.name}? | FurTools`;
    const description = f.short_answer.length > 155 ? f.short_answer.slice(0, 152) + "…" : f.short_answer;
    const url = `/foods/${params.slug}`;
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
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Can pets eat ${f.name}?`,
            description,
            url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Foods", url: "/foods" },
              { name: f.name, url },
            ]),
          ),
        },
        ...(f.faqs.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify(faqSchema(f.faqs.map((x) => ({ q: x.question, a: x.answer })))),
              },
            ]
          : []),
      ],
    };
  },
  component: FoodPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Food not found</h1>
      <p className="mt-3 text-muted-foreground">
        Browse the <Link to="/foods" className="text-primary underline">food database</Link>.
      </p>
    </div>
  ),
});

function FoodPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-14"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div>}>
      <FoodBody />
    </Suspense>
  );
}

function FoodBody() {
  const { slug } = Route.useParams();
  const { data: food } = useSuspenseQuery(foodDetailQuery(slug));
  if (!food) return null;

  const anyUnsafe = FOOD_SPECIES.some(
    (s) => ((food.species_safety[s.slug] ?? "unknown") as SafetyLevel) === "unsafe",
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Foods", to: "/foods" },
          { label: food.name },
        ]}
      />

      <header className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Food guide
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Can pets eat {food.name}?
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{food.short_answer}</p>
      </header>

      {/* Safety grid — all supported species */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FOOD_SPECIES.map((s) => (
          <SafetyCard
            key={s.slug}
            species={s.plural}
            emoji={s.emoji}
            level={(food.species_safety[s.slug] ?? "unknown") as SafetyLevel}
          />
        ))}
      </div>

      {/* Emergency banner if unsafe for any species */}
      {anyUnsafe && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-50/60 p-4 text-sm dark:bg-red-950/20">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden />
          <div>
            <strong>If ingested, call your vet or the Pet Poison Helpline at 1-855-764-7661 (USA).</strong>{" "}
            Time and amount consumed matter.
          </div>
        </div>
      )}

      {food.benefits && (
        <Section title="Benefits" icon={<Leaf className="size-5" />}>{food.benefits}</Section>
      )}
      {food.risks && (
        <Section title="Risks" icon={<AlertTriangle className="size-5" />}>{food.risks}</Section>
      )}
      {food.symptoms && (
        <Section title="Symptoms to watch for" icon={<Heart className="size-5" />}>{food.symptoms}</Section>
      )}
      {food.vet_advice && (
        <Section title="Vet advice" icon={<Stethoscope className="size-5" />}>{food.vet_advice}</Section>
      )}

      {food.alternatives.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            Safer alternatives
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {food.alternatives.map((a) => (
              <li
                key={a}
                className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300"
              >
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}

      {food.related_food_slugs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Related foods</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {food.related_food_slugs.map((s) => (
              <Link
                key={s}
                to="/foods/$slug"
                params={{ slug: s }}
                className="rounded-xl border border-border bg-card p-4 text-sm transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2 font-medium capitalize">
                  <BookOpen className="size-4 text-primary" aria-hidden />
                  {s.replace(/-/g, " ")}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {food.faqs.length > 0 && (
        <div className="mt-12">
          <Faq items={food.faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </div>
      )}

      <div className="mt-14 rounded-2xl border border-amber-500/30 bg-amber-50/60 p-4 text-sm dark:bg-amber-950/20">
        <strong>Not medical advice.</strong> This guide is educational — always consult your veterinarian
        for medical decisions, especially in emergencies.
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">{icon}</span>
        {title}
      </h2>
      <p className="mt-4 leading-relaxed text-foreground/90">{children}</p>
    </section>
  );
}

function SafetyCard({ species, emoji, level }: { species: string; emoji?: string; level: SafetyLevel }) {
  const m = safetyMeta(level);
  return (
    <div className={"flex items-center justify-between rounded-2xl border border-border bg-card p-4 ring-1 " + m.ring}>
      <div>
        <div className="text-xs text-muted-foreground">For {species}</div>
        <div className={"mt-1 font-display text-lg font-semibold " + m.color}>{m.label}</div>
      </div>
      <div className={"grid size-10 place-items-center rounded-full text-lg " + m.bg}>
        {emoji ?? (level === "safe" ? "✓" : level === "moderation" ? "!" : level === "unsafe" ? "✕" : "?")}
      </div>
    </div>
  );
}
