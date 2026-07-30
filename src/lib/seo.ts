// Centralized programmatic SEO metadata builder.
// Every shareable route uses buildHead() to guarantee title/description/OG/Twitter/canonical parity.
import { SITE } from "@/lib/site";

export interface HeadInput {
  title: string;
  description: string;
  path: string; // absolute path, always starts with "/"
  image?: string; // absolute URL preferred; relative works too (host resolves)
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noindex?: boolean;
  // extra meta / links / scripts to merge in
  extraMeta?: Array<Record<string, string>>;
  extraLinks?: Array<Record<string, string>>;
  schemas?: Array<Record<string, unknown>>;
}

export interface HeadFragment {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  scripts: Array<{ type: string; children: string }>;
}

const clamp = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

/**
 * Build a full head fragment: title, description, canonical, OG, Twitter, JSON-LD.
 * Route head() spreads this: `head: () => buildHead({...})`.
 */
export function buildHead(input: HeadInput): HeadFragment {
  const title = clamp(input.title, 60);
  const description = clamp(input.description, 158);
  const type = input.type ?? "website";
  const url = input.path;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    ...(input.noindex ? [{ name: "robots", content: "noindex,nofollow" }] : [{ name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" }]),
    ...(input.keywords?.length ? [{ name: "keywords", content: input.keywords.join(", ") }] : []),

    // Open Graph
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE.name },
    { property: "og:locale", content: "en_US" },
    ...(input.image ? [{ property: "og:image", content: input.image }] : []),
    ...(input.image && input.imageAlt ? [{ property: "og:image:alt", content: input.imageAlt }] : []),
    ...(input.publishedTime ? [{ property: "article:published_time", content: input.publishedTime }] : []),
    ...(input.modifiedTime ? [{ property: "article:modified_time", content: input.modifiedTime }] : []),

    // Twitter
    { name: "twitter:card", content: input.image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(input.image ? [{ name: "twitter:image", content: input.image }] : []),
    ...(input.image && input.imageAlt ? [{ name: "twitter:image:alt", content: input.imageAlt }] : []),

    ...(input.extraMeta ?? []),
  ];

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: url },
    ...(input.extraLinks ?? []),
  ];

  const scripts = (input.schemas ?? []).map((s) => ({
    type: "application/ld+json",
    children: JSON.stringify(s),
  }));

  return { meta, links, scripts };
}

/** Merge multiple HeadFragments (rarely needed — buildHead accepts extras). */
export function mergeHead(...fragments: HeadFragment[]): HeadFragment {
  return {
    meta: fragments.flatMap((f) => f.meta),
    links: fragments.flatMap((f) => f.links),
    scripts: fragments.flatMap((f) => f.scripts),
  };
}
