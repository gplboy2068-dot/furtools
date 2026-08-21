import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { STATIC_BLOG_POSTS } from "@/data/blog-posts";

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
    let allDbPosts: (PostSummary & { published?: boolean })[] = [];
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,cover_image,category,published,published_at,tags")
        .order("published_at", { ascending: false });
      if (data) allDbPosts = data;
    } catch (err) {
      console.warn("Supabase blog query failed, falling back to static:", err);
    }

    const publishedDbPosts: PostSummary[] = allDbPosts
      .filter((p) => p.published !== false)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        cover_image: p.cover_image,
        category: p.category,
        published_at: p.published_at,
        tags: p.tags,
      }));

    const combined = [...publishedDbPosts];
    Object.values(STATIC_BLOG_POSTS).forEach((sp) => {
      // Only include static post if it hasn't been saved in DB yet
      if (!allDbPosts.some((p) => p.slug === sp.slug)) {
        combined.push({
          slug: sp.slug,
          title: sp.title,
          excerpt: sp.excerpt,
          cover_image: sp.cover_image,
          category: sp.category,
          published_at: sp.published_at,
          tags: sp.tags,
        });
      }
    });

    return combined;
  },
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "FurTools Blog — Guides and stories for pet parents" },
      {
        name: "description",
        content:
          "Honest, useful writing on dogs, cats, and small pets — from care basics to deep dives, all free.",
      },
      { property: "og:title", content: "FurTools Blog" },
      { property: "og:description", content: "Honest, useful writing on pet care." },
      { property: "og:url", content: "/blog" },
    ],
    links: [
      { rel: "canonical", href: "/blog" },
      { rel: "alternate", type: "application/rss+xml", title: "FurTools Blog", href: "/rss.xml" },
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
