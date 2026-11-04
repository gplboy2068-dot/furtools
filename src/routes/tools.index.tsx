import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { useTranslatedCategories } from "@/lib/use-translated-categories";
import {
  TOOLS_SUMMARY,
  TOTAL_TOOLS_COUNT,
  searchToolsSummary,
  type ToolSummary,
} from "@/data/tools-summary";
import { breadcrumbSchema } from "@/lib/schema";
import { buildHead } from "@/lib/seo";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/tools/")({
  head: () =>
    buildHead({
      title: "All Pet Tools & Calculators — Dogs, Cats, Birds, Fish & More | FurTools",
      description:
        "Browse every free FurTools tool in one place: pet calculators, nutrition planners, breed and health identifiers, and care checkers for dogs, cats, birds, fish, reptiles and more.",
      path: "/tools",
      schemas: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ]),
      ],
    }),
  component: ToolsIndex,
});

function ToolsIndex() {
  const [q, setQ] = useState("");
  const categories = useTranslatedCategories();
  const results = useMemo(() => (q.trim() ? searchToolsSummary(q.trim()) : []), [q]);

  // Group the full catalogue by category, in category order. The "horse-tools"
  // category is an alias of "horses" (its tools carry category "horses"), so it
  // is skipped here to avoid listing the same tools twice.
  const groups = useMemo(
    () =>
      categories
        .filter((c) => c.slug !== "horse-tools")
        .map((c) => ({
          category: c,
          tools: TOOLS_SUMMARY.filter((t: ToolSummary) => t.category === c.slug),
        }))
        .filter((g) => g.tools.length > 0),
    [categories],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Tools" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Tools</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every FurTools tool in one place — {TOTAL_TOOLS_COUNT} free calculators, planners,
        identifiers and checkers for dogs, cats, birds, fish and more. Search directly for a
        specific tool, or browse the full list by pet below.
      </p>

      <div className="relative mt-6 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${TOTAL_TOOLS_COUNT} tools — try 'dog food' or 'aquarium'`}
          className="h-11 pl-9"
          aria-label="Search tools"
        />
      </div>

      {q.trim() ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            {results.length} tool{results.length === 1 ? "" : "s"} matching "{q.trim()}"
          </p>
          {results.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No matches. Try a broader term, or clear the search to browse every tool.
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {groups.map(({ category, tools }) => (
              <a
                key={category.slug}
                href={`#tools-${category.slug}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
              >
                {category.name} · {tools.length}
              </a>
            ))}
          </div>

          {groups.map(({ category, tools }) => (
            <section
              key={category.slug}
              id={`tools-${category.slug}`}
              className="mt-12 scroll-mt-24"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="max-w-2xl">
                  <h2 className="font-display text-2xl font-semibold">{category.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Link
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {tools.length} tool{tools.length === 1 ? "" : "s"} — view category
                </Link>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
