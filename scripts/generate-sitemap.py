#!/usr/bin/env python3
"""Regenerate public/sitemap.xml from the repo's own data files.

The live site serves the STATIC public/sitemap.xml (it shadows the dynamic
/src/routes/sitemap.xml.ts route on Cloudflare Workers). This script rebuilds
it so it only lists URLs that actually exist in this codebase — no dead links.

Usage: python3 scripts/generate-sitemap.py
"""
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://www.furtools.com"
TODAY = date.today().isoformat()


def slugs(pattern: str, path: str, flags: int = 0) -> list[str]:
    src = (ROOT / path).read_text(encoding="utf-8")
    return re.findall(pattern, src, flags)


def ai_slugs() -> list[str]:
    """Top-level AI assistant slugs only (4-space indented entries)."""
    src = (ROOT / "src/data/ai-assistants.ts").read_text(encoding="utf-8")
    body = src.split("export const AI_ASSISTANTS")[1]
    return re.findall(r'^    slug: "([a-z0-9-]+)",', body, re.M)


def blog_posts() -> list[tuple[str, str]]:
    src = (ROOT / "src/data/blog-posts.ts").read_text(encoding="utf-8")
    # published_at per slug (may include time component)
    pub = dict(re.findall(r'"slug": "([a-z0-9-]+)",\s*\n\s*"title".*?\n\s*"published_at": "([0-9-]+)', src))
    out = []
    for s in re.findall(r'^  "([a-z0-9-]+)": \{$', src, re.M):
        out.append((s, pub.get(s, TODAY)[:10]))
    # de-dupe preserving order
    seen: dict[str, str] = {}
    for slug, date in out:
        seen.setdefault(slug, date)
    return list(seen.items())


def tool_slugs() -> list[tuple[str, str]]:
    """(slug, updatedAt) for every tool in the registry."""
    src = (ROOT / "src/data/tools.ts").read_text(encoding="utf-8")
    entries = re.findall(
        r'slug: "([a-z0-9-]+)",.*?updatedAt: "([0-9-]+)"', src, re.S
    )
    # de-dupe preserving order
    seen: dict[str, str] = {}
    for slug, updated in entries:
        seen.setdefault(slug, updated)
    return list(seen.items())


def entry(path: str, lastmod: str | None = None,
          changefreq: str = "monthly", priority: str = "0.5") -> str:
    lines = ["  <url>", f"    <loc>{BASE_URL}{path}</loc>"]
    if lastmod:
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
    lines.append(f"    <changefreq>{changefreq}</changefreq>")
    lines.append(f"    <priority>{priority}</priority>")
    lines.append("  </url>")
    return "\n".join(lines)


def main() -> None:
    urls: list[str] = []

    # Static hub pages (mirrors src/routes/sitemap.xml.ts)
    static_pages = [
        ("/", "daily", "1.0"),
        ("/categories", "weekly", "0.8"),
        ("/breeds", "weekly", "0.8"),
        ("/compare", "weekly", "0.7"),
        ("/foods", "weekly", "0.8"),
        ("/names", "weekly", "0.7"),
        ("/cost-planner", "monthly", "0.7"),
        ("/care", "monthly", "0.5"),
        ("/ai", "weekly", "0.8"),
        ("/blog", "weekly", "0.7"),
        ("/about", "yearly", "0.4"),
        ("/contact", "yearly", "0.4"),
        ("/privacy", "yearly", "0.2"),
        ("/terms", "yearly", "0.2"),
        ("/disclaimer", "yearly", "0.2"),
        ("/author/firoz-khan", "yearly", "0.3"),
    ]
    for path, freq, prio in static_pages:
        urls.append(entry(path, TODAY if path == "/" else None, freq, prio))

    for slug in slugs(r'slug: "([a-z0-9-]+)"', "src/data/categories.ts"):
        urls.append(entry(f"/categories/{slug}", None, "weekly", "0.7"))

    for slug, updated in tool_slugs():
        urls.append(entry(f"/tools/{slug}", updated, "monthly", "0.8"))

    for slug in ai_slugs():
        urls.append(entry(f"/ai/{slug}", None, "monthly", "0.7"))

    for slug in slugs(r'"slug": "([a-z0-9-]+)"', "src/data/fallback-breeds.ts"):
        urls.append(entry(f"/breeds/{slug}", None, "monthly", "0.7"))

    for slug in slugs(r'"slug": "([a-z0-9-]+)"', "src/data/fallback-foods.ts"):
        urls.append(entry(f"/foods/{slug}", None, "monthly", "0.7"))

    for slug, published in blog_posts():
        urls.append(entry(f"/blog/{slug}", published, "monthly", "0.6"))

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    out = ROOT / "public" / "sitemap.xml"
    out.write_text(xml, encoding="utf-8")
    print(f"Wrote {out} — {len(urls)} URLs")


if __name__ == "__main__":
    sys.exit(main())
