import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AI_ASSISTANTS } from "@/data/ai-assistants";
import { breadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/ai/")({
  head: () => {
    const title = "AI Pet Assistants — Free Chat with Pet Experts | FurTools";
    const description =
      "Free AI-powered pet assistants for care, training, food safety, grooming, travel, breed advice, and pet names. Educational — never a replacement for your vet.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/ai" },
      ],
      links: [{ rel: "canonical", href: "/ai" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "AI Assistants", url: "/ai" },
            ]),
          ),
        },
      ],
    };
  },
  component: AiHub,
});

function AiHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "AI Assistants" }]} />

      <header className="mt-6 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" /> Powered by Lovable AI
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI Pet Assistants
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Chat with warm, knowledgeable AI helpers for every corner of pet life — from training and
          nutrition to travel and grooming. Free, private on your device, and always deferring to
          your vet on health.
        </p>
      </header>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AI_ASSISTANTS.map((a) => {
          const Icon = a.icon;
          return (
            <li key={a.slug}>
              <Link
                to="/ai/$slug"
                params={{ slug: a.slug }}
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold group-hover:text-primary">
                  {a.name}
                </h2>
                <p className="mt-1 text-sm text-primary/80">{a.tagline}</p>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Start chat →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        <strong>Educational only.</strong> These AI tools are for educational purposes and do not
        replace professional veterinary advice, diagnosis, or treatment.
      </p>
    </div>
  );
}
