import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { CATEGORIES } from "@/data/categories";
import { toolsByCategory, searchTools } from "@/data/tools";
import { PawPrint, Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Pet Tool Categories — FurTools" },
      {
        name: "description",
        content: "Browse every category of free pet tools — dogs, cats, nutrition, health, names, and training.",
      },
      { property: "og:title", content: "Pet Tool Categories — FurTools" },
      { property: "og:description", content: "Free pet tool categories organized for dogs, cats, and small companions." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const [q, setQ] = useState("");
  const results = useMemo(() => (q.trim() ? searchTools(q.trim()) : []), [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Categories</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every FurTools tool grouped by what you're trying to figure out. Pick a category to
        see the tools inside — or search directly for a specific tool.
      </p>

      <div className="relative mt-6 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 300+ tools — try 'dog food' or 'aquarium'"
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
              {results.slice(0, 24).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No matches. Try a broader term or browse by category below.
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const count = toolsByCategory(c.slug).length;
            return (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border/70 bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <PawPrint className="size-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">{c.name}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-4 text-xs font-medium text-muted-foreground">
                  {count} tool{count === 1 ? "" : "s"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
