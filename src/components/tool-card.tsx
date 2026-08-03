import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
    >
      <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-primary">
            {tool.layout}
          </div>
          <h3 className="font-display text-lg font-semibold leading-tight">{tool.name}</h3>
          <p className="text-sm text-muted-foreground">{tool.tagline}</p>
          <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
            Open tool <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
