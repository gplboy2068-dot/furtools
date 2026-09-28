import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { STATIC_BLOG_POSTS } from "@/data/blog-posts";
import { getDbBlogPosts } from "@/lib/d1";
import { breadcrumbSchema } from "@/lib/schema";
import { buildHead, toAbsoluteUrl } from "@/lib/seo";

interface PostSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
  tags: string[];
}

const postsQuery = queryOptions({
  queryKey: ["blog", "posts"],
  queryFn: async (): Promise<PostSummary[]> => {
    // 1. Client-side browser fetch
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list as PostSummary[];
          }
        }
      } catch (err) {
        console.warn("Client fetch /api/blog failed, using fallback:", err);
      }
    }

    // 2. Server-side D1 query
    try {
      const d1Posts = await getDbBlogPosts();
      if (d1Posts && d1Posts.length > 0) {
        return d1Posts as PostSummary[];
      }
    } catch (d1Err) {
      console.warn("D1 blog posts query error:", d1Err);
    }

    // 3. Fallback to static blog posts
    return Object.values(STATIC_BLOG_POSTS).map((sp) => ({
      slug: sp.slug,
      title: sp.title,
      excerpt: sp.excerpt,
      cover_image: sp.cover_image,
      category: sp.category,
      published_at: sp.published_at,
      tags: sp.tags,
    }));
  },
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () =>
    buildHead({
      title: "Pet Care Blog, Guides & Veterinary Advice | FurTools",
      description:
        "Practical veterinary guides, canine nutrition breakdowns, cat behavior insights, and emergency pet care tips from animal specialists.",
      path: "/blog",
      extraLinks: [
        { rel: "alternate", type: "application/rss+xml", title: "FurTools Blog", href: toAbsoluteUrl("/rss.xml") },
      ],
      schemas: [
        breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]),
      ],
    }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <header className="mt-6">
        <h1 className="font-display text-4xl font-semibold">The FurTools Blog</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Practical guides, gentle opinions, and the occasional deep dive.
        </p>
      </header>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList />
      </Suspense>
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function PostsList() {
  const { data: posts } = useSuspenseQuery(postsQuery);

  if (posts.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
        No posts yet — check back soon.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {posts.map((p) => (
        <Link
          key={p.slug}
          to="/blog/$slug"
          params={{ slug: p.slug }}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-sm"
        >
          {p.cover_image ? (
            <img
              src={p.cover_image}
              alt=""
              className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20" />
          )}
          <div className="flex flex-1 flex-col gap-2 p-5">
            {p.category && (
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                {p.category}
              </div>
            )}
            <h2 className="font-display text-xl font-semibold leading-snug group-hover:text-primary">
              {p.title}
            </h2>
            {p.excerpt && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
            )}
            {p.published_at && (
              <time className="mt-auto pt-2 text-xs text-muted-foreground" dateTime={p.published_at}>
                {new Date(p.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
