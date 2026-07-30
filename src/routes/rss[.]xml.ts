import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

const BASE_URL = "";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data } = await supabase
          .from("blog_posts")
          .select("slug,title,excerpt,published_at")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(50);

        const items = (data ?? [])
          .map(
            (p) => `  <item>
    <title>${escape(p.title)}</title>
    <link>${BASE_URL}/blog/${p.slug}</link>
    <guid>${BASE_URL}/blog/${p.slug}</guid>
    ${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ""}
    <description>${escape(p.excerpt ?? "")}</description>
  </item>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escape(SITE.name)} Blog</title>
  <link>${BASE_URL}/blog</link>
  <description>${escape(SITE.description)}</description>
${items}
</channel>
</rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
