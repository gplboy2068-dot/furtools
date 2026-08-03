import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { TOOLS } from "@/data/tools";
import { CATEGORIES } from "@/data/categories";
import { supabase } from "@/integrations/supabase/client";

// TODO: replace with the production URL once a project domain is configured.
const BASE_URL = "";

interface Entry {
  path: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/categories", changefreq: "weekly", priority: "0.8" },
          { path: "/breeds", changefreq: "weekly", priority: "0.8" },
          { path: "/compare", changefreq: "weekly", priority: "0.7" },
          { path: "/foods", changefreq: "weekly", priority: "0.8" },
          { path: "/names", changefreq: "weekly", priority: "0.7" },
          { path: "/cost-planner", changefreq: "monthly", priority: "0.7" },
          { path: "/care", changefreq: "monthly", priority: "0.5" },
          { path: "/ai", changefreq: "weekly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/about", changefreq: "yearly", priority: "0.4" },
          { path: "/contact", changefreq: "yearly", priority: "0.4" },
          { path: "/privacy", changefreq: "yearly", priority: "0.2" },
          { path: "/terms", changefreq: "yearly", priority: "0.2" },
          { path: "/disclaimer", changefreq: "yearly", priority: "0.2" },
        ];

        for (const c of CATEGORIES) {
          entries.push({ path: `/categories/${c.slug}`, changefreq: "weekly", priority: "0.7" });
        }
        for (const t of TOOLS) {
          entries.push({ path: `/tools/${t.slug}`, changefreq: "monthly", priority: "0.8" });
        }

        // AI assistants
        const { AI_ASSISTANTS } = await import("@/data/ai-assistants");
        for (const a of AI_ASSISTANTS) {
          entries.push({ path: `/ai/${a.slug}`, changefreq: "monthly", priority: "0.7" });
        }

        try {
          const { data } = await supabase
            .from("breeds")
            .select("slug,updated_at")
            .eq("published", true);
          for (const b of data ?? []) {
            entries.push({
              path: `/breeds/${b.slug}`,
              lastmod: b.updated_at,
              changefreq: "monthly",
              priority: "0.7",
            });
          }
        } catch {
          // ignore — breeds sitemap entries optional
        }

        try {
          const { data } = await supabase
            .from("foods")
            .select("slug,updated_at")
            .eq("published", true);
          for (const f of data ?? []) {
            entries.push({
              path: `/foods/${f.slug}`,
              lastmod: f.updated_at,
              changefreq: "monthly",
              priority: "0.7",
            });
          }
        } catch {
          // ignore — foods sitemap entries optional
        }

        try {
          const { data } = await supabase
            .from("blog_posts")
            .select("slug,updated_at")
            .eq("published", true);
          for (const p of data ?? []) {
            entries.push({
              path: `/blog/${p.slug}`,
              lastmod: p.updated_at,
              changefreq: "monthly",
              priority: "0.6",
            });
          }
        } catch {
          // ignore — blog is optional in the sitemap
        }

        const urls = entries.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            "  </url>",
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
