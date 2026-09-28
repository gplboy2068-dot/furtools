// Cloudflare D1 Database Client and Helper functions
import { getD1 } from "./cloudflare-context";

export interface D1BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  author_id: string;
  tags: string[];
  published: number;
  published_at: string;
}

export async function getDbBlogPosts(): Promise<Partial<D1BlogPost>[]> {
  const db = getD1();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare(
        "SELECT slug, title, excerpt, cover_image, category, tags, published_at FROM blog_posts WHERE published = 1 ORDER BY published_at DESC"
      )
      .all();
    return (results || []).map((p: any) => ({
      ...p,
      tags: typeof p.tags === "string" ? safeJsonParse(p.tags, []) : (p.tags || []),
    }));
  } catch (err) {
    console.warn("D1 getDbBlogPosts error:", err);
    return [];
  }
}

export async function getDbBlogPostBySlug(slug: string): Promise<D1BlogPost | null> {
  const db = getD1();
  if (!db) return null;
  try {
    const post = await db
      .prepare("SELECT * FROM blog_posts WHERE slug = ? AND published = 1 LIMIT 1")
      .bind(slug)
      .first();
    if (!post) return null;
    return {
      ...post,
      tags: typeof post.tags === "string" ? safeJsonParse(post.tags, []) : (post.tags || []),
    };
  } catch (err) {
    console.warn(`D1 getDbBlogPostBySlug error (${slug}):`, err);
    return null;
  }
}

export async function getDbSiteSettings(): Promise<Record<string, string>> {
  const db = getD1();
  if (!db) return {};
  try {
    const { results } = await db.prepare("SELECT key, value FROM site_settings").all();
    const map: Record<string, string> = {};
    for (const r of (results || [])) {
      map[r.key] = r.value;
    }
    return map;
  } catch (err) {
    console.warn("D1 getDbSiteSettings error:", err);
    return {};
  }
}

export async function getDbSpeciesCatalog(): Promise<any[]> {
  const db = getD1();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare("SELECT * FROM species_catalog WHERE enabled = 1 ORDER BY sort_order ASC")
      .all();
    return results || [];
  } catch (err) {
    console.warn("D1 getDbSpeciesCatalog error:", err);
    return [];
  }
}

export async function getDbBreeds(): Promise<any[]> {
  const db = getD1();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare("SELECT * FROM breeds WHERE published = 1 ORDER BY name ASC")
      .all();
    return (results || []).map((b: any) => ({
      ...b,
      temperament_traits: typeof b.temperament_traits === 'string' ? safeJsonParse(b.temperament_traits, []) : (b.temperament_traits || []),
      common_diseases: typeof b.common_diseases === 'string' ? safeJsonParse(b.common_diseases, []) : (b.common_diseases || []),
      images: typeof b.images === 'string' ? safeJsonParse(b.images, []) : (b.images || []),
      faqs: typeof b.faqs === 'string' ? safeJsonParse(b.faqs, []) : (b.faqs || []),
      related_tool_slugs: typeof b.related_tool_slugs === 'string' ? safeJsonParse(b.related_tool_slugs, []) : (b.related_tool_slugs || []),
      related_article_slugs: typeof b.related_article_slugs === 'string' ? safeJsonParse(b.related_article_slugs, []) : (b.related_article_slugs || []),
      good_with: typeof b.good_with === 'string' ? safeJsonParse(b.good_with, {}) : (b.good_with || {}),
      coat_colors: typeof b.coat_colors === 'string' ? safeJsonParse(b.coat_colors, []) : (b.coat_colors || []),
    }));
  } catch (err) {
    console.warn("D1 getDbBreeds error:", err);
    return [];
  }
}

export async function getDbBreedBySlug(slug: string): Promise<any | null> {
  const db = getD1();
  if (!db) return null;
  try {
    const b = await db
      .prepare("SELECT * FROM breeds WHERE slug = ? AND published = 1 LIMIT 1")
      .bind(slug)
      .first();
    if (!b) return null;
    return {
      ...b,
      temperament_traits: typeof b.temperament_traits === 'string' ? safeJsonParse(b.temperament_traits, []) : (b.temperament_traits || []),
      common_diseases: typeof b.common_diseases === 'string' ? safeJsonParse(b.common_diseases, []) : (b.common_diseases || []),
      images: typeof b.images === 'string' ? safeJsonParse(b.images, []) : (b.images || []),
      faqs: typeof b.faqs === 'string' ? safeJsonParse(b.faqs, []) : (b.faqs || []),
      related_tool_slugs: typeof b.related_tool_slugs === 'string' ? safeJsonParse(b.related_tool_slugs, []) : (b.related_tool_slugs || []),
      related_article_slugs: typeof b.related_article_slugs === 'string' ? safeJsonParse(b.related_article_slugs, []) : (b.related_article_slugs || []),
      good_with: typeof b.good_with === 'string' ? safeJsonParse(b.good_with, {}) : (b.good_with || {}),
      coat_colors: typeof b.coat_colors === 'string' ? safeJsonParse(b.coat_colors, []) : (b.coat_colors || []),
    };
  } catch (err) {
    console.warn(`D1 getDbBreedBySlug error (${slug}):`, err);
    return null;
  }
}

export async function getDbFoods(): Promise<any[]> {
  const db = getD1();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare("SELECT * FROM foods WHERE published = 1 ORDER BY name ASC")
      .all();
    return (results || []).map((f: any) => ({
      ...f,
      species_safety: typeof f.species_safety === 'string' ? safeJsonParse(f.species_safety, {}) : (f.species_safety || {}),
      alternatives: typeof f.alternatives === 'string' ? safeJsonParse(f.alternatives, []) : (f.alternatives || []),
      related_food_slugs: typeof f.related_food_slugs === 'string' ? safeJsonParse(f.related_food_slugs, []) : (f.related_food_slugs || []),
      faqs: typeof f.faqs === 'string' ? safeJsonParse(f.faqs, []) : (f.faqs || []),
      keywords: typeof f.keywords === 'string' ? safeJsonParse(f.keywords, []) : (f.keywords || []),
    }));
  } catch (err) {
    console.warn("D1 getDbFoods error:", err);
    return [];
  }
}

export async function getDbFoodBySlug(slug: string): Promise<any | null> {
  const db = getD1();
  if (!db) return null;
  try {
    const f = await db
      .prepare("SELECT * FROM foods WHERE slug = ? AND published = 1 LIMIT 1")
      .bind(slug)
      .first();
    if (!f) return null;
    return {
      ...f,
      species_safety: typeof f.species_safety === 'string' ? safeJsonParse(f.species_safety, {}) : (f.species_safety || {}),
      alternatives: typeof f.alternatives === 'string' ? safeJsonParse(f.alternatives, []) : (f.alternatives || []),
      related_food_slugs: typeof f.related_food_slugs === 'string' ? safeJsonParse(f.related_food_slugs, []) : (f.related_food_slugs || []),
      faqs: typeof f.faqs === 'string' ? safeJsonParse(f.faqs, []) : (f.faqs || []),
      keywords: typeof f.keywords === 'string' ? safeJsonParse(f.keywords, []) : (f.keywords || []),
    };
  } catch (err) {
    console.warn(`D1 getDbFoodBySlug error (${slug}):`, err);
    return null;
  }
}

function safeJsonParse(str: string, fallback: any) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
