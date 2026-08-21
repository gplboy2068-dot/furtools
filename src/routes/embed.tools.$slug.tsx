import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTool } from "@/data/tools";
import { TOOL_COMPONENTS } from "@/components/tools/registry";
import { Sparkles, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/embed/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Calculator Embed — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const { tool } = loaderData;
    return {
      meta: [
        { title: `${tool.name} — Free Interactive Embed | FurTools` },
        { name: "description", content: `Embed ${tool.name} on your website or blog.` },
        { name: "robots", content: "all" },
      ],
    };
  },
  component: EmbedToolPage,
});

function EmbedToolPage() {
  const { tool } = Route.useLoaderData();
  const ToolComponent = TOOL_COMPONENTS[tool.slug];

  if (!ToolComponent) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground font-sans">
        Calculator component not available for embed.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-3 sm:p-4 antialiased flex flex-col justify-between">
      <div className="w-full max-w-3xl mx-auto">
        {/* Tool Header in Embed */}
        <div className="mb-4 pb-3 border-b border-border/80 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg sm:text-xl tracking-tight text-foreground">
              {tool.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {tool.description}
            </p>
          </div>
          <a
            href={`https://furtools.com/tools/${tool.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Full Tool</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Embedded Interactive Tool */}
        <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
          <ToolComponent />
        </div>
      </div>

      {/* Powered by FurTools Backlink Attribution Footer */}
      <footer className="mt-4 pt-3 border-t border-border/60 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <span>⚡ Interactive Pet Calculator Powered by</span>
          <a
            href="https://furtools.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>FurTools.com</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
