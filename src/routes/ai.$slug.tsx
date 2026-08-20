import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AssistantChat } from "@/components/ai/assistant-chat";
import { AI_ASSISTANTS, getAssistant } from "@/data/ai-assistants";
import { breadcrumbSchema, faqSchema, softwareApplicationSchema } from "@/lib/schema";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  HeartPulse,
  HelpCircle,
  Sparkles,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/ai/$slug")({
  loader: ({ params }) => {
    const a = getAssistant(params.slug);
    if (!a) throw notFound();
    return { slug: a.slug };
  },
  head: ({ loaderData, params }) => {
    const a = getAssistant(loaderData?.slug ?? params.slug);
    if (!a) {
      return {
        meta: [{ title: "AI Assistant — FurTools" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${a.name} — Free AI Chat, Care Guide & FAQs | FurTools`;
    const description = `${a.description} Free, private AI pet assistant with in-depth care guides, FAQs, and calculation tools.`;
    const url = `/ai/${a.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            softwareApplicationSchema({
              name: a.name,
              description: a.description,
              url,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "AI Assistants", url: "/ai" },
              { name: a.name, url },
            ]),
          ),
        },
        ...(a.faqs?.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify(faqSchema(a.faqs)),
              },
            ]
          : []),
      ],
    };
  },
  component: AiAssistantPage,
  notFoundComponent: AiNotFound,
});

function AiAssistantPage() {
  const { slug } = Route.useLoaderData();
  const assistant = getAssistant(slug);
  if (!assistant) return <AiNotFound />;
  const Icon = assistant.icon || HeartPulse;
  const others = AI_ASSISTANTS.filter((a) => a.slug !== assistant.slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "AI Assistants", to: "/ai" },
          { label: assistant.name },
        ]}
      />

      {/* Header */}
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xs">
            <Icon className="size-7" aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {assistant.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3" /> AI
              </span>
            </div>
            <p className="mt-1 text-base text-muted-foreground">{assistant.tagline}</p>
          </div>
        </div>
      </header>

      {/* Interactive AI Chat Box */}
      <div className="mt-8">
        <AssistantChat assistant={assistant} />
      </div>

      {/* 300–500 Words In-Depth Guide */}
      {assistant.longDescription && (
        <section className="mt-14 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-4" /> Comprehensive Care Guide & Science
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Everything You Need to Know About {assistant.name.replace("AI ", "")}
          </h2>
          <div className="mt-6 border-t border-border pt-6">
            <FormattedMarkdown content={assistant.longDescription} />
          </div>

          {/* Key Capabilities */}
          {assistant.keyFeatures && assistant.keyFeatures.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-display text-lg font-semibold">Core Capabilities & Highlights</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {assistant.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/30 p-3.5"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span className="text-sm font-medium text-foreground/90">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Interlinked Related Calculators & Tools */}
      {assistant.relatedTools && assistant.relatedTools.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Calculator className="size-4" /> Interlinked Tools
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Related Pet Calculators & Guides
              </h2>
            </div>
            <Link
              to="/categories"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              Browse all tools <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assistant.relatedTools.map((tool) => (
              <Link
                key={tool.slug}
                to="/tools/$slug"
                params={{ slug: tool.slug }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Wrench className="size-5" />
                  </div>
                  <h3 className="mt-3.5 font-display text-base font-semibold group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open Calculator <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5 Dedicated FAQs Accordion */}
      {assistant.faqs && assistant.faqs.length > 0 && (
        <section className="mt-14 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <HelpCircle className="size-4" /> Frequently Asked Questions
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Common Questions About {assistant.name.replace("AI ", "")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick, reliable answers regarding nutrition, behaviors, housing, and veterinary guidelines.
          </p>

          <Accordion type="single" collapsible className="mt-6 divide-y divide-border">
            {assistant.faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-border/80 py-1">
                <AccordionTrigger className="text-left font-display text-base font-semibold text-foreground hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* More AI Helpers Section */}
      <section className="mt-14">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-4" /> Explore Assistants
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              More AI Care Helpers
            </h2>
          </div>
          <Link
            to="/ai"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            View all 24 assistants <ArrowRight className="size-4" />
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => {
            const OtherIcon = a.icon;
            return (
              <li key={a.slug}>
                <Link
                  to="/ai/$slug"
                  params={{ slug: a.slug }}
                  className="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <OtherIcon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <div className="font-display font-semibold group-hover:text-primary transition-colors">
                      {a.name}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {a.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Safety & Medical Disclaimer Banner */}
      <div className="mt-14 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
        <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p>
          <strong>Medical & Educational Disclaimer:</strong> All AI assistants and calculation guides on FurTools are designed solely for general pet care education and daily wellness planning. They do not constitute veterinary medical diagnosis, prescription, or clinical treatment. Always consult a licensed veterinarian for urgent health issues or medication advice.
        </p>
      </div>
    </div>
  );
}

function AiNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Assistant not found</h1>
      <p className="mt-3 text-muted-foreground">
        This AI assistant doesn't exist yet.
      </p>
      <Link to="/ai" className="mt-6 inline-block text-primary underline">
        View all AI assistants
      </Link>
    </div>
  );
}

