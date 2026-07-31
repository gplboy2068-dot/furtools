import { createFileRoute, notFound } from "@tanstack/react-router";
import { ToolPageShell } from "@/components/layouts/tool-page-shell";
import { getTool } from "@/data/tools";
import { getCategory } from "@/data/categories";
import { TOOL_COMPONENTS } from "@/components/tools/registry";
import { breadcrumbSchema, faqSchema, softwareApplicationSchema } from "@/lib/schema";

const DEFAULT_FAQS = [
  { q: "Is this tool free?", a: "Yes — every tool on FurTools is free and requires no signup." },
  { q: "Is my data stored?", a: "No. All calculations happen in your browser and nothing is sent to a server." },
  {
    q: "Can I trust the results?",
    a: "Our tools use commonly accepted veterinary formulas and public research. For medical decisions, always consult your vet.",
  },
];

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.slug) {
      return { meta: [{ title: "Tool not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const tool = getTool(loaderData.slug);
    if (!tool) {
      return { meta: [{ title: "Tool not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${tool.name} — FurTools`;
    return {
      meta: [
        { title },
        { name: "description", content: tool.description },
        { name: "keywords", content: tool.keywords.join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: tool.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/tools/${tool.slug}` },
      ],
      links: [{ rel: "canonical", href: `/tools/${tool.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Tools", url: "/tools" },
              { name: tool.name, url: `/tools/${tool.slug}` },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            softwareApplicationSchema({
              name: tool.name,
              description: tool.description,
              url: `/tools/${tool.slug}`,
              applicationCategory: "HealthApplication",
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema(DEFAULT_FAQS)),
        },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: ToolNotFound,
});

function ToolPage() {
  const { slug } = Route.useLoaderData();
  const tool = getTool(slug);
  if (!tool) return <ToolNotFound />;

  const category = getCategory(tool.category);
  const ToolComp = TOOL_COMPONENTS[tool.componentKey];

  return (
    <ToolPageShell tool={tool} category={category} faqs={DEFAULT_FAQS}>
      {ToolComp ? (
        <ToolComp />
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          Interactive calculator for {tool.name} is coming soon.
        </div>
      )}
    </ToolPageShell>
  );
}

function ToolNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Tool not found</h1>
      <p className="mt-3 text-muted-foreground">
        We couldn't find the requested tool. It may have been renamed or moved.
      </p>
    </div>
  );
}
