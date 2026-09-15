/**
 * IndexNow Bulk URL Submitter for FurTools
 * Submits all active URLs to Bing, Yandex, Seznam, Naver, and IndexNow central engines.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const INDEXNOW_KEY = "e8f49a2b7c6d5e1f0a3b8c9d2e4f6a7b";
const HOSTS = ["www.furtools.com", "furtools.com"];

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
  "https://search.seznam.cz/indexnow",
  "https://searchadvisor.naver.com/indexnow",
];

const BASE_STATIC_PATHS = [
  "/",
  "/categories",
  "/breeds",
  "/foods",
  "/names",
  "/compare",
  "/cost-planner",
  "/care",
  "/ai",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/categories/dogs",
  "/categories/cats",
  "/categories/birds",
  "/categories/fish",
  "/categories/small-pets",
  "/categories/reptiles",
  "/categories/horses",
  "/categories/farm",
  "/categories/general",
  "/ai/dog-training",
  "/ai/cat-care",
  "/ai/bird-care",
  "/ai/fish-care",
  "/ai/rabbit-care",
  "/ai/snake-care",
  "/ai/lizard-care",
  "/ai/chicken-care",
  "/ai/duck-care",
  "/ai/goat-care",
  "/ai/sheep-care",
  "/ai/horse-care",
  "/ai/hamster-care",
  "/ai/guinea-pig-care",
  "/ai/ferret-care",
  "/ai/turtle-care",
];

function collectAllPaths() {
  const allPaths = new Set(BASE_STATIC_PATHS);

  // 1. Collect all blog posts from src/data/blog-posts.ts
  try {
    const blogFile = fs.readFileSync(path.join(rootDir, "src/data/blog-posts.ts"), "utf-8");
    const blogRegex = /"slug":\s*"([^"]+)"/g;
    let match;
    while ((match = blogRegex.exec(blogFile)) !== null) {
      if (match[1]) {
        allPaths.add(`/blog/${match[1]}`);
      }
    }
  } catch (err) {
    console.warn("Could not parse blog-posts.ts:", err.message);
  }

  // 2. Collect all tools from src/data/tools.ts
  try {
    const toolsFile = fs.readFileSync(path.join(rootDir, "src/data/tools.ts"), "utf-8");
    const toolRegex = /slug:\s*["']([^"']+)["']/g;
    let match;
    while ((match = toolRegex.exec(toolsFile)) !== null) {
      const slug = match[1];
      // Only include if it doesn't contain a slash and isn't already a blog post
      if (slug && !slug.includes("/") && slug.length > 2 && !allPaths.has(`/blog/${slug}`)) {
        allPaths.add(`/tools/${slug}`);
      }
    }
  } catch (err) {
    console.warn("Could not parse tools.ts:", err.message);
  }

  return Array.from(allPaths);
}

async function runIndexNow() {
  const discoveredPaths = collectAllPaths();
  console.log(`\n📦 Discovered ${discoveredPaths.length} unique URLs across FurTools (tools, blog posts, AI assistants, categories).`);

  // Synchronize public/sitemap.xml with all discovered URLs
  try {
    const today = new Date().toISOString().slice(0, 10);
    const xmlEntries = discoveredPaths.map((p) => {
      let prio = "0.7";
      let freq = "weekly";
      if (p === "/") {
        prio = "1.0";
        freq = "daily";
      } else if (p.startsWith("/tools/")) {
        prio = "0.8";
        freq = "monthly";
      } else if (p.startsWith("/blog/")) {
        prio = "0.8";
        freq = "monthly";
      } else if (p.startsWith("/categories/")) {
        prio = "0.8";
        freq = "weekly";
      }
      return `  <url>\n    <loc>https://www.furtools.com${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
    });

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries.join("\n")}\n</urlset>\n`;
    fs.writeFileSync(path.join(rootDir, "public/sitemap.xml"), sitemapXml, "utf-8");
    console.log(`🗺️  [Sitemap] Synchronized public/sitemap.xml with ${discoveredPaths.length} URLs.`);
  } catch (err) {
    console.warn("Could not update public/sitemap.xml:", err.message);
  }

  for (const host of HOSTS) {
    const keyLocation = `https://${host}/${INDEXNOW_KEY}.txt`;
    const fullUrls = discoveredPaths.map((p) => `https://${host}${p}`);
    console.log(`\n🚀 [IndexNow] Submitting ${fullUrls.length} URLs for ${host}...`);

    const payload = {
      host: host,
      key: INDEXNOW_KEY,
      keyLocation: keyLocation,
      urlList: fullUrls,
    };

    for (const endpoint of ENDPOINTS) {
      try {
        console.log(`📡 Pinging ${endpoint} for ${host}...`);
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        console.log(`   ➔ Response: ${response.status} ${response.statusText}`);
        if (response.status === 200 || response.status === 202) {
          console.log(`   ✅ Successfully submitted ${fullUrls.length} URLs!`);
        } else {
          const text = await response.text();
          console.log(`   ℹ️ Note: ${text || response.statusText}`);
        }
      } catch (err) {
        console.error(`   ❌ Failed to ping ${endpoint}:`, err.message);
      }
    }
  }

  console.log(`\n✨ [IndexNow] Process completed successfully.\n`);
}

runIndexNow();
