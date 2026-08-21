import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPostLayout } from "@/components/layouts/blog-post-layout";
import { FormattedMarkdown } from "@/components/ui/formatted-markdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { STATIC_BLOG_POSTS } from "@/data/blog-posts";
import { HelpCircle } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
  tags: string[];
  faqs?: { q: string; a: string }[];
}

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: async (): Promise<Post> => {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("slug,title,excerpt,content,cover_image,category,published_at,tags")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        if (data) {
          const staticPost = STATIC_BLOG_POSTS[slug];
          return {
            ...data,
            faqs: staticPost?.faqs,
          } as Post;
        }
      } catch (err) {
        console.warn("Supabase blog query failed, falling back to static:", err);
      }

      if (STATIC_BLOG_POSTS[slug]) {
        const p = STATIC_BLOG_POSTS[slug];
        return {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          cover_image: p.cover_image,
          category: p.category,
          published_at: p.published_at,
          tags: p.tags,
          faqs: p.faqs,
        };
      }

      throw notFound();
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
    const scripts: { type: string; children: string }[] = [
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
    ];

    if (loaderData.faqs && loaderData.faqs.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(faqSchema(loaderData.faqs)),
      });
    }

    return {
      meta: [
        { title: `${loaderData.title} — FurTools Blog` },
        { name: "description", content: loaderData.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt ?? "" },
        { property: "og:url", url },
        ...(loaderData.cover_image ? [{ property: "og:image", content: loaderData.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
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

function PostBody() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
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
      <FormattedMarkdown content={post.content} />

      {post.faqs && post.faqs.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border/80">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="size-6 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground m-0">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full divide-y divide-border/60">
            {post.faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-none py-1">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-3">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-1 pb-3 text-sm">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
    </BlogPostLayout>
  );
}
