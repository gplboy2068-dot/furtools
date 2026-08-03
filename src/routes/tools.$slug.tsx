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
    const category = getCategory(tool.category);
    return { tool, category };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Tool not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const { tool } = loaderData;
    const title = `${tool.name} — FurTools`;
    return {
      meta: [
        { title },
        { name: "description", content: tool.description },
        { name: "keywords", content: tool.keywords.join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: tool.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/tools/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/tools/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            softwareApplicationSchema({
              name: tool.name,
              description: tool.description,
              url: `/tools/${params.slug}`,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Categories", url: "/categories" },
              ...(loaderData.category
                ? [{ name: loaderData.category.name, url: `/categories/${loaderData.category.slug}` }]
                : []),
              { name: tool.name, url: `/tools/${params.slug}` },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema(tool.faqs?.length ? tool.faqs : DEFAULT_FAQS)),
        },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Tool not found</h1>
    </div>
  ),
});

function ToolPage() {
  const { tool, category } = Route.useLoaderData();
  const ToolComponent = TOOL_COMPONENTS[tool.slug];

  return (
    <ToolPageShell
      slug={tool.slug}
      title={tool.name}
      description={tool.description}
      category={category ? { slug: category.slug, name: category.name } : { slug: "", name: "" }}
      crumbs={[
        { label: "Categories", to: "/categories" },
        ...(category
          ? [{ label: category.name, to: "/categories/$slug", params: { slug: category.slug } }]
          : []),
        { label: tool.name },
      ]}
      faqs={tool.faqs?.length ? tool.faqs : DEFAULT_FAQS}
      examples={tool.examples}
      relatedArticles={tool.relatedArticles}
      medicalDisclaimer={tool.medicalDisclaimer}
      howItWorks={<p>{tool.howItWorks}</p>}
    >
      {ToolComponent ? (
        <ToolComponent />
      ) : (
        <div className="rounded-xl bg-muted p-6 text-center text-muted-foreground">
          This tool is coming soon.
        </div>
      )}
    </ToolPageShell>
  );
}
