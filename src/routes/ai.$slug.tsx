import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AssistantChat } from "@/components/ai/assistant-chat";
import { AI_ASSISTANTS, getAssistant } from "@/data/ai-assistants";
import { breadcrumbSchema } from "@/lib/schema";

export const Route = createFileRoute("/ai/$slug")({
  loader: ({ params }) => {
    const a = getAssistant(params.slug);
    if (!a) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const slug = loaderData?.slug;
    const a = slug ? getAssistant(slug) : null;
    if (!a) {
      return {
        meta: [{ title: "AI Assistant — FurTools" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${a.name} — Free AI Chat | FurTools`;
    const description = `${a.description} Free, private, and educational. Not a replacement for professional veterinary advice.`;
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
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "AI Assistants", url: "/ai" },
              { name: a.name, url },
            ]),
          ),
        },
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

  const Icon = assistant.icon;
  const others = AI_ASSISTANTS.filter((a) => a.slug !== assistant.slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "AI Assistants", to: "/ai" },
          { label: assistant.name },
        ]}
      />

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-7" aria-hidden />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {assistant.name}
            </h1>
            <p className="mt-1 text-muted-foreground">{assistant.tagline}</p>
          </div>
        </div>
      </header>

      <div className="mt-8">
        <AssistantChat assistant={assistant} />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">More AI helpers</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => {
            const OtherIcon = a.icon;
            return (
              <li key={a.slug}>
                <Link
                  to="/ai/$slug"
                  params={{ slug: a.slug }}
                  className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <OtherIcon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-primary">{a.name}</div>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                      {a.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
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
