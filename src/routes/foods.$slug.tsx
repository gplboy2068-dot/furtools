import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
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
import { foodDetailQuery, safetyMeta, type SafetyLevel } from "@/lib/foods";
import { useTranslatedFood, useTranslatedFoodLabels } from "@/lib/use-translated-foods";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { toAbsoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/foods/$slug")({
  loader: async ({ params, context }) => {
    // Canonicalize known duplicate slugs (e.g. /foods/apples → /foods/apple)
    // so duplicate content never gets indexed under two URLs.
    const FOOD_SLUG_ALIASES: Record<string, string> = {
      apples: "apple",
    };
    const canonical = FOOD_SLUG_ALIASES[params.slug];
    if (canonical) {
      throw redirect({ to: "/foods/$slug", params: { slug: canonical }, statusCode: 301 });
    }
    const food = await context.queryClient.ensureQueryData(foodDetailQuery(params.slug));
    if (!food) throw notFound();
    return food;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Food not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const f = loaderData;
    const title = `Can Dogs and Cats Eat ${f.name}? Toxicity & Safety | FurTools`;
    const description = f.short_answer.length > 155 ? f.short_answer.slice(0, 152) + "…" : f.short_answer;
    const canonicalUrl = toAbsoluteUrl(`/foods/${params.slug}`);
    const imageUrl = toAbsoluteUrl("/og-image.png");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:site_name", content: SITE.name },
        { property: "og:image", content: imageUrl },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Can pets eat ${f.name}?`,
            description,
            url: canonicalUrl,
            image: imageUrl,
            author: { "@type": "Organization", name: SITE.name, url: SITE.url },
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
            about: {
              "@type": "Thing",
              name: f.name,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Foods", url: "/foods" },
              { name: f.name, url: canonicalUrl },
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
  notFoundComponent: FoodNotFound,
});

function FoodNotFound() {
  const { t } = useTranslation("foods");
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">{t("ui.notFoundTitle")}</h1>
      <p className="mt-3 text-muted-foreground">
        <Link to="/foods" className="text-primary underline">{t("ui.notFoundLink")}</Link>
      </p>
    </div>
  );
}

function FoodPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-14"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div>}>
      <FoodBody />
    </Suspense>
  );
}

function FoodBody() {
  const { t } = useTranslation("foods");
  const { slug } = Route.useParams();
  const { data: food } = useSuspenseQuery(foodDetailQuery(slug));
  const tf = useTranslatedFood(food!);
  const { species, safetyLabel } = useTranslatedFoodLabels();
  if (!food) return null;

  const anyUnsafe = species.some(
    (s) => ((food.species_safety[s.slug] ?? "unknown") as SafetyLevel) === "unsafe",
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: t("ui.detailBreadcrumbFoods"), to: "/foods" },
          { label: tf.name },
        ]}
      />

      <header className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {t("ui.foodGuide")}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("ui.detailTitle", { name: tf.name })}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{tf.short_answer}</p>
      </header>

      {/* Safety grid — all supported species */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {species.map((s) => (
          <SafetyCard
            key={s.slug}
            species={t("ui.forSpecies", { species: s.plural })}
            emoji={s.emoji}
            level={(food.species_safety[s.slug] ?? "unknown") as SafetyLevel}
            label={safetyLabel((food.species_safety[s.slug] ?? "unknown") as SafetyLevel)}
          />
        ))}
      </div>

      {/* Emergency banner if unsafe for any species */}
      {anyUnsafe && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-50/60 p-4 text-sm dark:bg-red-950/20">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden />
          <div>
            <strong>{t("ui.emergencyBanner")}</strong>{" "}
            {t("ui.emergencyBannerSuffix")}
          </div>
        </div>
      )}

      {tf.benefits && (
        <Section title={t("ui.sectionBenefits")} icon={<Leaf className="size-5" />}>{tf.benefits}</Section>
      )}
      {tf.risks && (
        <Section title={t("ui.sectionRisks")} icon={<AlertTriangle className="size-5" />}>{tf.risks}</Section>
      )}
      {tf.symptoms && (
        <Section title={t("ui.sectionSymptoms")} icon={<Heart className="size-5" />}>{tf.symptoms}</Section>
      )}
      {tf.vet_advice && (
        <Section title={t("ui.sectionVetAdvice")} icon={<Stethoscope className="size-5" />}>{tf.vet_advice}</Section>
      )}

      {tf.alternatives.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            {t("ui.saferAlternatives")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tf.alternatives.map((a) => (
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
          <h2 className="font-display text-2xl font-semibold">{t("ui.relatedFoods")}</h2>
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

      {tf.faqs.length > 0 && (
        <div className="mt-12">
          <Faq items={tf.faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </div>
      )}

      <div className="mt-14 rounded-2xl border border-amber-500/30 bg-amber-50/60 p-4 text-sm dark:bg-amber-950/20">
        <strong>{t("ui.disclaimerTitle")}</strong> {t("ui.disclaimerBody")}
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

function SafetyCard({ species, emoji, level, label }: { species: string; emoji?: string; level: SafetyLevel; label: string }) {
  const m = safetyMeta(level);
  return (
    <div className={"flex items-center justify-between rounded-2xl border border-border bg-card p-4 ring-1 " + m.ring}>
      <div>
        <div className="text-xs text-muted-foreground">{species}</div>
        <div className={"mt-1 font-display text-lg font-semibold " + m.color}>{label}</div>
      </div>
      <div className={"grid size-10 place-items-center rounded-full text-lg " + m.bg}>
        {emoji ?? (level === "safe" ? "✓" : level === "moderation" ? "!" : level === "unsafe" ? "✕" : "?")}
      </div>
    </div>
  );
}
