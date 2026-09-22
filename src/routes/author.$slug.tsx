import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAuthor, DEFAULT_AUTHOR } from "@/data/authors";
import { STATIC_BLOG_POSTS } from "@/data/blog-posts";
import { personSchema, breadcrumbSchema } from "@/lib/schema";
import { toAbsoluteUrl } from "@/lib/seo";
import {
  ExternalLink,
  Wrench,
  BookOpen,
  Compass,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

// Official LinkedIn and Instagram SVGs
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export const Route = createFileRoute("/author/$slug")({
  loader: ({ params }) => {
    const author = getAuthor(params.slug);
    if (!author) {
      throw notFound();
    }
    return { author };
  },
  head: ({ loaderData, params }) => {
    const author = loaderData?.author ?? DEFAULT_AUTHOR;
    const canonicalUrl = toAbsoluteUrl(`/author/${params.slug}`);
    const imageUrl = toAbsoluteUrl(author.avatar);

    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify(personSchema(author)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Authors", url: "/author/firoz-khan" },
            { name: author.name, url: canonicalUrl },
          ]),
        ),
      },
    ];

    return {
      meta: [
        { title: `${author.name} — ${author.role} | FurTools` },
        { name: "description", content: author.shortBio },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:type", content: "profile" },
        { property: "og:title", content: `${author.name} — ${author.role}` },
        { property: "og:description", content: author.shortBio },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${author.name} — ${author.role}` },
        { name: "twitter:description", content: author.shortBio },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts,
    };
  },
  component: AuthorProfilePage,
});

function AuthorProfilePage() {
  const { author } = Route.useLoaderData();

  // Get articles authored by or attributed to this author
  const allPosts = Object.values(STATIC_BLOG_POSTS);
  // Firoz Khan is the founder & primary author; all platform posts reflect his curation/authorship
  const authorPosts = allPosts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Authors", to: "/author/firoz-khan" },
          { label: author.name },
        ]}
      />

      {/* Author Bio Header Card */}
      <section className="mt-8 rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-md sm:size-36">
            <img
              src={author.avatar}
              alt={author.name}
              className="size-full object-cover object-center"
              loading="eager"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {author.name}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {author.role}
                  </span>
                  <span className="text-xs text-muted-foreground">· FurTools Founder</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {author.socials.linkedin && (
                  <a
                    href={author.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 hover:text-[#0077b5]"
                    aria-label={`${author.name} on LinkedIn`}
                  >
                    <LinkedInIcon className="size-4 fill-current" />
                    <span>LinkedIn</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                )}
                {author.socials.instagram && (
                  <a
                    href={author.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 hover:text-[#E1306C]"
                    aria-label={`${author.name} on Instagram`}
                  >
                    <InstagramIcon className="size-4 fill-current" />
                    <span>Instagram</span>
                    <ExternalLink className="size-3 opacity-60" />
                  </a>
                )}
              </div>
            </div>

            {/* Bio paragraphs */}
            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {author.bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Areas of Interest */}
            <div className="mt-6 border-t border-border/60 pt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Areas of Focus & Development
              </h2>
              <div className="flex flex-wrap gap-2">
                {author.areasOfInterest.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Standards & Transparency Statement */}
      <section className="mt-8 rounded-2xl border border-border/70 bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <ShieldCheck className="size-6 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1.5">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">
              Editorial Integrity & Veterinary Disclaimer
            </h3>
            <p>
              At FurTools, all calculator algorithms and nutritional equations are designed around standard veterinary guidelines (including WSAVA, AAHA, and NRC nutritional models). Articles published by Firoz Khan synthesize peer-reviewed companion animal literature, toxicological datasets, and husbandry standards into easy-to-use formats.
            </p>
            <p>
              FurTools does not provide veterinary medical diagnoses or clinical prescriptions. All digital tools and articles are intended as educational references to support productive consultations with licensed veterinary professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Created / Managed */}
      {author.toolsManaged && author.toolsManaged.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="size-5 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Tools Created & Managed
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {author.toolsManaged.map((tool) => (
              <Link
                key={tool.url}
                to={tool.url}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{tool.name}</span>
                    <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>Open Tool</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles Published / Curated */}
      <section className="mt-14">
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Articles & Guides by {author.name}
            </h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {authorPosts.length} published resources
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {authorPosts.slice(0, 12).map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-semibold uppercase tracking-wider text-primary">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Read article</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {authorPosts.length > 12 && (
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              <span>Explore all {authorPosts.length} guides on the FurTools Blog</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
