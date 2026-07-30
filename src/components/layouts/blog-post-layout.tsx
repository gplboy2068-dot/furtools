import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";

export interface BlogPostMeta {
  title: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string;
  coverImage?: string;
  category?: string;
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
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={crumbs} />
      <header className="mt-6">
        {meta.category && (
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {meta.category}
          </div>
        )}
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {meta.title}
        </h1>
        {meta.excerpt && (
          <p className="mt-3 text-lg text-muted-foreground">{meta.excerpt}</p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          {meta.author && <span>{meta.author}</span>}
          {meta.author && meta.publishedAt && <span> · </span>}
          {meta.publishedAt && (
            <time dateTime={meta.publishedAt}>
              {new Date(meta.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>
      </header>
      {meta.coverImage && (
        <img
          src={meta.coverImage}
          alt=""
          className="mt-8 aspect-video w-full rounded-2xl object-cover"
          loading="lazy"
        />
      )}
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-display">
        {children}
      </div>
    </article>
  );
}
