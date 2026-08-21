import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { RelatedTools } from "@/components/tool-sections";
import { Faq, type FaqItem } from "@/components/faq";
import { AlertTriangle, BookOpen } from "lucide-react";
import { EmbedCalculatorDialog } from "@/components/tools/embed-dialog";
import type { ToolExample, RelatedArticle } from "@/data/tools";

export interface ToolLayoutProps {
  slug: string;
  title: string;
  description: string;
  category: { slug: string; name: string };
  crumbs: Crumb[];
  children: ReactNode; // tool UI
  intro?: ReactNode;
  howItWorks?: ReactNode;
  faqs?: FaqItem[];
  examples?: ToolExample[];
  relatedArticles?: RelatedArticle[];
  medicalDisclaimer?: boolean;
}

export function ToolPageShell({
  title,
  description,
  crumbs,
  children,
  intro,
  howItWorks,
  faqs,
  slug,
  examples,
  relatedArticles,
  medicalDisclaimer,
}: ToolLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={crumbs} />
        <EmbedCalculatorDialog slug={slug} title={title} />
      </div>
      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      </header>

      {intro && <div className="prose prose-neutral mt-8 max-w-3xl dark:prose-invert">{intro}</div>}

      <div className="mt-8 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-8">
        {children}
      </div>

      {medicalDisclaimer && (
        <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-sm dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
          <div>
            <strong className="font-semibold">Not medical advice.</strong>{" "}
            This tool provides general guidance based on common veterinary formulas. Always consult your veterinarian
            for medical decisions about your pet.
          </div>
        </div>
      )}

      {howItWorks && (
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">How it works</h2>
          <div className="prose prose-neutral mt-4 dark:prose-invert">{howItWorks}</div>
        </section>
      )}

      {examples && examples.length > 0 && (
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold">Examples</h2>
          <ul className="mt-4 space-y-3">
            {examples.map((ex) => (
              <li key={ex.label} className="flex flex-col gap-1 rounded-xl bg-cream p-4 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-sm text-muted-foreground">{ex.label}</span>
                <span className="font-medium text-primary">{ex.result}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <div className="mt-16">
          <Faq items={faqs} />
        </div>
      )}

      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Related reading</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((a) => (
              <li key={a.slug}>
                <a
                  href={`/blog/${a.slug}`}
                  className="flex h-full gap-3 rounded-xl border border-border/60 bg-card p-4 transition hover:border-primary/60 hover:shadow-sm"
                >
                  <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span className="text-sm font-medium">{a.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RelatedTools slug={slug} />
    </div>
  );
}
