import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPostLayout } from "@/components/layouts/blog-post-layout";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
  tags: string[];
}

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: async (): Promise<Post> => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,content,cover_image,category,published_at,tags")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Post;
    },
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post not found — FurTools" }, { name: "robots", content: "noindex" }] };
    }
    const url = `/blog/${params.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} — FurTools Blog` },
        { name: "description", content: loaderData.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt ?? "" },
        { property: "og:url", content: url },
        ...(loaderData.cover_image ? [{ property: "og:image", content: loaderData.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            articleSchema({
              title: loaderData.title,
              description: loaderData.excerpt ?? undefined,
              url,
              datePublished: loaderData.published_at ?? undefined,
              image: loaderData.cover_image ?? undefined,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: loaderData.title, url },
            ]),
          ),
        },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Post not found</h1>
      <p className="mt-3 text-muted-foreground">This post may have been removed or unpublished.</p>
    </div>
  ),
});

function BlogPostPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-14"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div>}>
      <PostBody />
    </Suspense>
  );
}

import { useLocalizedRecord } from "@/lib/i18n-db";

function PostBody() {
  const { slug } = Route.useParams();
  const { data: rawPost } = useSuspenseQuery(postQuery(slug));
  const post = (useLocalizedRecord(rawPost) || rawPost) as Post;
  return (
    <BlogPostLayout
      meta={{
        title: post.title,
        excerpt: post.excerpt ?? undefined,
        publishedAt: post.published_at ?? undefined,
        coverImage: post.cover_image ?? undefined,
        category: post.category ?? undefined,
      }}
      crumbs={[{ label: "Blog", to: "/blog" }, { label: post.title }]}
    >
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </BlogPostLayout>
  );
}
