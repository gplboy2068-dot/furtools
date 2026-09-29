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

export async function getDbPets(userId: string): Promise<any[]> {
  const db = getD1();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare("SELECT * FROM pets WHERE user_id = ? ORDER BY created_at DESC")
      .bind(userId)
      .all();
    const rows = results || [];
    return rows.map((p: any) => {
      if (p && typeof p.species_data === "string") {
        try { p.species_data = JSON.parse(p.species_data); } catch { /* ignore */ }
      }
      return p;
    });
  } catch (err) {
    console.warn("D1 getDbPets error:", err);
    return [];
  }
}

export async function getDbPetById(id: string): Promise<any | null> {
  const db = getD1();
  if (!db) return null;
  try {
    const pet: any = await db.prepare("SELECT * FROM pets WHERE id = ? LIMIT 1").bind(id).first();
    if (pet && typeof pet.species_data === "string") {
      try { pet.species_data = JSON.parse(pet.species_data); } catch { /* ignore */ }
    }
    return pet;
  } catch (err) {
    console.warn("D1 getDbPetById error:", err);
    return null;
  }
}

export async function insertDbPet(pet: any): Promise<any> {
  const db = getD1();
  if (!db) throw new Error("D1 database not available");
  const id = pet.id || crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO pets (id, user_id, name, species, breed, gender, birthdate, weight, weight_unit, avatar_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .bind(
      id,
      pet.user_id,
      pet.name,
      pet.species,
      pet.breed || null,
      pet.gender || null,
      pet.birthdate || null,
      pet.weight != null && !isNaN(Number(pet.weight)) ? Number(pet.weight) : null,
      pet.weight_unit || "lbs",
      pet.avatar_url || null
    )
    .run();
  return { id, ...pet };
}

export async function updateDbPet(id: string, updates: any): Promise<boolean> {
  const db = getD1();
  if (!db) return false;
  const allowed = [
    "name", "species", "breed", "secondary_breed", "is_mixed_breed",
    "gender", "birthdate", "adoption_date", "color", "weight", "weight_unit",
    "height", "height_unit", "microchip_number", "neutered", "avatar_url",
    "favorite_food", "favorite_toy", "breeder_shelter", "medical_notes", "notes",
    "species_data"
  ];
  const fields: string[] = [];
  const values: any[] = [];
  for (const k of allowed) {
    if (k in updates) {
      fields.push(`${k} = ?`);
      let val = updates[k];
      if (k === "species_data" && val !== null && typeof val === "object") {
        val = JSON.stringify(val);
      } else if (typeof val === "boolean") {
        val = val ? 1 : 0;
      }
      values.push(val);
    }
  }
  if (fields.length === 0) return true;
  fields.push("updated_at = datetime('now')");
  values.push(id);
  const sql = `UPDATE pets SET ${fields.join(", ")} WHERE id = ?`;
  await db.prepare(sql).bind(...values).run();
  return true;
}

export async function deleteDbPet(id: string): Promise<boolean> {
  const db = getD1();
  if (!db) return false;
  const subTables = [
    "pet_health_events", "pet_vaccinations", "pet_medications",
    "pet_weight_logs", "pet_vet_visits", "pet_allergies",
    "pet_documents", "pet_expenses", "pet_grooming",
    "pet_deworming", "pet_journal", "pet_travel", "pet_reminders"
  ];
  for (const table of subTables) {
    try {
      await db.prepare(`DELETE FROM ${table} WHERE pet_id = ?`).bind(id).run();
    } catch { /* ignore */ }
  }
  await db.prepare("DELETE FROM pets WHERE id = ?").bind(id).run();
  return true;
}

const ALLOWED_PET_TABLES = new Set([
  "pet_health_events", "pet_vaccinations", "pet_medications",
  "pet_weight_logs", "pet_vet_visits", "pet_allergies",
  "pet_documents", "pet_expenses", "pet_grooming",
  "pet_deworming", "pet_journal", "pet_travel", "pet_reminders"
]);

export async function getDbPetRecords(table: string, petId: string): Promise<any[]> {
  const db = getD1();
  if (!db || !ALLOWED_PET_TABLES.has(table)) return [];
  try {
    let orderBy = "created_at DESC";
    if (table === "pet_weight_logs") orderBy = "logged_at DESC";
    else if (table === "pet_vaccinations") orderBy = "next_due_at ASC, given_at DESC";
    else if (table === "pet_medications") orderBy = "start_date DESC";
    else if (table === "pet_vet_visits") orderBy = "visited_at DESC";
    else if (table === "pet_journal") orderBy = "entry_date DESC";
    else if (table === "pet_expenses") orderBy = "spent_on DESC";

    const { results } = await db.prepare(`SELECT * FROM ${table} WHERE pet_id = ? ORDER BY ${orderBy}`).bind(petId).all();
    const rows = results || [];
    return rows.map((r: any) => {
      if (r && typeof r.tags === "string") {
        try { r.tags = JSON.parse(r.tags); } catch { /* ignore */ }
      }
      return r;
    });
  } catch (err) {
    console.warn(`D1 getDbPetRecords (${table}) error:`, err);
    return [];
  }
}

export async function insertDbPetRecord(table: string, record: any): Promise<any> {
  const db = getD1();
  if (!db || !ALLOWED_PET_TABLES.has(table)) throw new Error("Invalid table");
  const id = record.id || crypto.randomUUID();
  const keys = Object.keys(record).filter((k) => k !== "id");
  const hasUpdatedAt = table !== "pet_weight_logs";
  const cols = ["id", ...keys, "created_at"];
  if (hasUpdatedAt) cols.push("updated_at");

  const now = new Date().toISOString();
  const values = [
    id,
    ...keys.map((k) => {
      const v = record[k];
      if (v !== null && typeof v === "object") return JSON.stringify(v);
      if (typeof v === "boolean") return v ? 1 : 0;
      return v;
    }),
    now,
  ];
  if (hasUpdatedAt) values.push(now);

  const placeholders = cols.map(() => "?").join(", ");
  const sql = `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders})`;
  await db.prepare(sql).bind(...values).run();
  return { id, ...record };
}

export async function updateDbPetRecord(table: string, id: string, updates: any): Promise<boolean> {
  const db = getD1();
  if (!db || !ALLOWED_PET_TABLES.has(table)) return false;
  const keys = Object.keys(updates).filter((k) => k !== "id");
  if (keys.length === 0) return true;
  const setClauses: string[] = [];
  const values: any[] = [];
  for (const k of keys) {
    setClauses.push(`${k} = ?`);
    const v = updates[k];
    if (v !== null && typeof v === "object") {
      values.push(JSON.stringify(v));
    } else if (typeof v === "boolean") {
      values.push(v ? 1 : 0);
    } else {
      values.push(v);
    }
  }
  if (table !== "pet_weight_logs") {
    setClauses.push("updated_at = datetime('now')");
  }
  values.push(id);
  const sql = `UPDATE ${table} SET ${setClauses.join(", ")} WHERE id = ?`;
  await db.prepare(sql).bind(...values).run();
  return true;
}

export async function deleteDbPetRecord(table: string, id: string): Promise<boolean> {
  const db = getD1();
  if (!db || !ALLOWED_PET_TABLES.has(table)) return false;
  await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
  return true;
}


