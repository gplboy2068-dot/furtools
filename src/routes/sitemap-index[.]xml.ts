// Sitemap index — points crawlers to all sub-sitemaps.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://www.furtools.com";

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString();
        const sitemaps = ["/sitemap.xml", "/sitemap-images.xml", "/news-sitemap.xml"];
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...sitemaps.map(
            (s) => `  <sitemap>\n    <loc>${BASE_URL}${s}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
          ),
          "</sitemapindex>",
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
