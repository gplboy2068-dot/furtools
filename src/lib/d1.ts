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

function safeJsonParse(str: string, fallback: any) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
