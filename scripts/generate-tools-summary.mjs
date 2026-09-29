import fs from 'fs';
import { TOOLS } from '../src/data/tools.ts';

const summaries = TOOLS.map((t) => ({
  slug: t.slug,
  name: t.name,
  tagline: t.tagline,
  category: t.category,
  keywords: t.keywords,
  layout: t.layout,
  featured: t.featured,
  popular: t.popular,
}));

const fileContent = `// Auto-generated lightweight tool summaries for fast client-side listing & homepage rendering.
// This prevents downloading hundreds of kilobytes of veterinary guides & formulas on pages that only display cards.

export type ToolCategory = "dogs" | "cats" | "birds" | "fish" | "small-pets" | "reptiles" | "horses" | "farm" | "general";
export type ToolLayout = "calculator" | "generator" | "guide";

export interface ToolSummary {
  slug: string;
  name: string;
  tagline: string;
  category: ToolCategory;
  keywords: string[];
  layout: ToolLayout;
  featured?: boolean;
  popular?: boolean;
}

export const TOOLS_SUMMARY: ToolSummary[] = ${JSON.stringify(summaries, null, 2)};

export const TOTAL_TOOLS_COUNT = TOOLS_SUMMARY.length;

export function featuredToolsSummary(limit = 4): ToolSummary[] {
  return TOOLS_SUMMARY.filter((t) => t.featured).slice(0, limit);
}

export function popularToolsSummary(limit = 6): ToolSummary[] {
  return TOOLS_SUMMARY.filter((t) => t.popular).slice(0, limit);
}

export function toolsByCategorySummary(categorySlug: string): ToolSummary[] {
  const norm = categorySlug.toLowerCase().trim();
  if (norm === "horse-tools" || norm === "horses") {
    return TOOLS_SUMMARY.filter((t) => t.category === "horses" || t.category === "horse-tools");
  }
  if (norm.endsWith("-tools")) {
    const base = norm.replace(/-tools$/, "");
    return TOOLS_SUMMARY.filter((t) => t.category === norm || t.category === base || t.category === \`\${base}s\`);
  }
  return TOOLS_SUMMARY.filter((t) => t.category === categorySlug);
}

export function searchToolsSummary(query: string): ToolSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TOOLS_SUMMARY.filter((t) => {
    return (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}

export function relatedToolsSummary(slug: string, limit = 3): ToolSummary[] {
  const tool = TOOLS_SUMMARY.find((t) => t.slug === slug);
  if (!tool) return [];
  const others = TOOLS_SUMMARY.filter((t) => t.slug !== slug);
  const scored = others.map((t) => {
    let score = 0;
    if (t.category === tool.category) score += 5;
    const overlap = t.keywords.filter((k) => tool.keywords.includes(k)).length;
    score += overlap;
    return { t, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.t);
}
`;

fs.writeFileSync('src/data/tools-summary.ts', fileContent, 'utf8');
console.log(`Generated src/data/tools-summary.ts with ${summaries.length} tools!`);
