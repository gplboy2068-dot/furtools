// Google News sitemap. Lists blog posts published in the last 48 hours.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

const BASE_URL = "";

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        let posts: Array<{ slug: string; title: string; published_at: string | null; category: string | null }> = [];
        try {
          const { data } = await supabase
            .from("blog_posts")
            .select("slug,title,published_at,category")
            .eq("published", true)
            .gte("published_at", cutoff)
            .order("published_at", { ascending: false })
            .limit(1000);
          posts = (data ?? []) as typeof posts;
        } catch { /* optional */ }

        const urls = posts.map(
          (p) =>
            `  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${p.published_at ?? new Date().toISOString()}</news:publication_date>
      <news:title>${escapeXml(p.title)}</news:title>${p.category ? `\n      <news:keywords>${escapeXml(p.category)}</news:keywords>` : ""}
    </news:news>
  </url>`,
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=600" },
        });
      },
    },
  },
});
