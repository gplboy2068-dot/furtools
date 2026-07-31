import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { getCategory, CATEGORIES } from "@/data/categories";
import { toolsByCategory } from "@/data/tools";
import { breadcrumbSchema } from "@/lib/schema";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.slug) {
      return { meta: [{ title: "Category not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const category = getCategory(loaderData.slug);
    if (!category) {
      return { meta: [{ title: "Category not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${category.name} pet tools — FurTools`;
    return {
      meta: [
        { title },
        { name: "description", content: category.description },
        { property: "og:title", content: title },
        { property: "og:description", content: category.description },
        { property: "og:url", content: `/categories/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/categories/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Categories", url: "/categories" },
              { name: category.name, url: `/categories/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Category not found</h1>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const category = getCategory(slug);
  if (!category) return null;

  const tools = toolsByCategory(category.slug);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tools;
    return tools.filter(
      (t: import("@/data/tools").Tool) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.keywords.some((k) => k.toLowerCase().includes(query)),
    );
  }, [tools, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Categories", to: "/categories" },
          { label: category.name },
        ]}
      />
      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">{category.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{category.description}</p>
      </header>

      <div className="relative mt-6 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search in ${category.name.toLowerCase()}…`}
          className="h-11 pl-9"
          aria-label={`Search ${category.name} tools`}
        />
      </div>
      {q.trim() && (
        <p className="mt-3 text-sm text-muted-foreground">
          {filtered.length} of {tools.length} tools match "{q.trim()}"
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t: import("@/data/tools").Tool) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          {q.trim() ? "No tools match your search in this category." : "Tools in this category are coming soon."}
        </div>
      )}

      <aside className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Other categories
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <a
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              {c.name}
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}
