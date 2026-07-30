// Image sitemap. Lists pages that carry meaningful images with their <image:loc>.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

interface ImgEntry {
  path: string;
  images: { loc: string; title?: string; caption?: string }[];
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

export const Route = createFileRoute("/sitemap-images.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: ImgEntry[] = [];

        try {
          const { data } = await supabase
            .from("breeds")
            .select("slug,name,hero_image,images")
            .eq("published", true);
          for (const b of data ?? []) {
            const imgs: ImgEntry["images"] = [];
            if (b.hero_image) imgs.push({ loc: b.hero_image, title: b.name, caption: `${b.name} breed profile` });
            for (const im of (b.images ?? []) as string[]) imgs.push({ loc: im, title: b.name });
            if (imgs.length) entries.push({ path: `/breeds/${b.slug}`, images: imgs });
          }
        } catch { /* optional */ }

        try {
          const { data } = await supabase
            .from("foods")
            .select("slug,name,image_url")
            .eq("published", true);
          for (const f of data ?? []) {
            if (f.image_url) entries.push({ path: `/foods/${f.slug}`, images: [{ loc: f.image_url, title: f.name, caption: `Can pets eat ${f.name}?` }] });
          }
        } catch { /* optional */ }

        try {
          const { data } = await supabase
            .from("blog_posts")
            .select("slug,title,cover_image")
            .eq("published", true);
          for (const p of data ?? []) {
            if (p.cover_image) entries.push({ path: `/blog/${p.slug}`, images: [{ loc: p.cover_image, title: p.title }] });
          }
        } catch { /* optional */ }

        const urls = entries.map((e) => {
          const imageBlocks = e.images
            .map(
              (im) =>
                `    <image:image>\n      <image:loc>${escapeXml(im.loc)}</image:loc>${
                  im.title ? `\n      <image:title>${escapeXml(im.title)}</image:title>` : ""
                }${im.caption ? `\n      <image:caption>${escapeXml(im.caption)}</image:caption>` : ""}\n    </image:image>`,
            )
            .join("\n");
          return `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n${imageBlocks}\n  </url>`;
        });

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
