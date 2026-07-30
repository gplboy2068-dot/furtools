import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { searchTools, TOOLS } from "@/data/tools";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search pet tools — FurTools" },
      { name: "description", content: "Search across every FurTools calculator, generator, and guide." },
      { property: "og:title", content: "Search pet tools — FurTools" },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [value, setValue] = useState(q ?? "");

  const results = useMemo(() => (q ? searchTools(q) : TOOLS), [q]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Search FurTools</h1>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: { q: value || undefined } });
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Try 'dog age' or 'name generator'"
            className="pl-9 h-11"
            autoFocus
          />
        </div>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        {q ? `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"` : `Browsing all ${results.length} tools`}
      </p>
      {results.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Nothing matched. Try a broader term.
        </div>
      )}
    </div>
  );
}
