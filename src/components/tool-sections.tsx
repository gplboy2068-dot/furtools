import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { relatedTools, popularTools, featuredTools, type Tool } from "@/data/tools";
import { ToolCard } from "./tool-card";
import { ArrowRight } from "lucide-react";

function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <ToolCard key={t.slug} tool={t} />
      ))}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href?: string;
}) {
  const { t } = useTranslation(["common", "home"]);
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-primary">{eyebrow}</div>
        <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link
          to="/categories"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          {t("common:actions.browseAll", "Browse all")} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

export function FeaturedTools({ limit = 4 }: { limit?: number }) {
  const { t } = useTranslation(["home"]);
  const tools = featuredTools(limit);
  if (!tools.length) return null;
  return (
    <section aria-labelledby="featured-heading">
      <SectionHeader
        eyebrow={t("home:featuredEyebrow", "Featured")}
        title={t("home:featuredTitle", "Handpicked tools for pet parents")}
        href="/categories"
      />
      <ToolGrid tools={tools} />
    </section>
  );
}

export function PopularTools({ limit = 6 }: { limit?: number }) {
  const { t } = useTranslation(["home"]);
  const tools = popularTools(limit);
  if (!tools.length) return null;
  return (
    <section aria-labelledby="popular-heading">
      <SectionHeader
        eyebrow={t("home:popularEyebrow", "Popular")}
        title={t("home:popularTitle", "What pet owners love this week")}
        href="/categories"
      />
      <ToolGrid tools={tools} />
    </section>
  );
}

export function RelatedTools({ slug, limit = 3 }: { slug: string; limit?: number }) {
  const { t } = useTranslation(["tools"]);
  const tools = relatedTools(slug, limit);
  if (!tools.length) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="font-display text-2xl font-semibold">
        {t("tools:relatedTools", "Related tools")}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
