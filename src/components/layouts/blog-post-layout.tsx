import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { AuthorBox } from "@/components/blog/author-box";
import { getAuthor } from "@/data/authors";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export interface BlogPostMeta {
  title: string;
  excerpt?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  authorSlug?: string;
  coverImage?: string;
  category?: string;
  reviewer?: {
    name: string;
    role: string;
  };
}

export function BlogPostLayout({
  meta,
  crumbs,
  children,
}: {
  meta: BlogPostMeta;
  crumbs: Crumb[];
  children: ReactNode;
}) {
  const author = getAuthor(meta.authorSlug || meta.author || "firoz-khan");

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6">
        {meta.category && (
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {meta.category}
          </div>
        )}
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-tight">
          {meta.title}
        </h1>
        {meta.excerpt && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {meta.excerpt}
          </p>
        )}

        {/* E-E-A-T Attribution Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={author.avatar}
              alt={author.name}
              className="size-6 rounded-full object-cover border border-border"
              loading="lazy"
            />
            <span>
              Written by{" "}
              <Link
                to={`/author/${author.slug}`}
                className="font-semibold text-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-2"
              >
                {author.name}
              </Link>
            </span>
          </div>

          {/* Published Date */}
          {meta.publishedAt && (
            <>
              <span className="text-border">·</span>
              <div className="flex items-center gap-1">
                <span>Published:</span>
                <time dateTime={meta.publishedAt} className="font-medium text-foreground">
                  {new Date(meta.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </>
          )}

          {/* Updated Date */}
          {meta.modifiedAt && meta.modifiedAt !== meta.publishedAt && (
            <>
              <span className="text-border">·</span>
              <div className="flex items-center gap-1">
                <span>Updated:</span>
                <time dateTime={meta.modifiedAt} className="font-medium text-foreground">
                  {new Date(meta.modifiedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            </>
          )}

          {/* Fact-Checked Standard */}
          <span className="text-border">·</span>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            <span className="font-medium">Evidence-informed research</span>
          </div>

          {/* Real Reviewer only if assigned */}
          {meta.reviewer && (
            <>
              <span className="text-border">·</span>
              <div className="flex items-center gap-1">
                <span>Reviewed by {meta.reviewer.name}</span>
                <span className="text-[10px] text-muted-foreground">({meta.reviewer.role})</span>
              </div>
            </>
          )}
        </div>
      </header>

      {meta.coverImage && (
        <img
          src={meta.coverImage}
          alt={meta.title}
          className="mt-8 aspect-video w-full rounded-2xl object-cover shadow-sm"
          loading="lazy"
        />
      )}

      {/* Main Content */}
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-display">
        {children}
      </div>

      {/* Veterinary Educational Disclaimer */}
      <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs leading-relaxed text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 mb-1">
          <ShieldAlert className="size-4" />
          <span>Veterinary & Health Information Notice</span>
        </div>
        This guide and associated FurTools calculators are created for educational and baseline planning purposes only. They do not constitute veterinary medical advice, physical diagnosis, or clinical treatment plans. Always consult a licensed veterinary doctor regarding any acute symptoms, medical emergencies, dietary transitions, or pharmacological questions.
      </div>

      {/* Author Bio Box */}
      <section className="mt-8">
        <AuthorBox author={author} />
      </section>
    </article>
  );
}
