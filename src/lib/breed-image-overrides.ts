// Breed hero image overrides (added 2026-11-10).
//
// The R2 object at "breeds/french-bulldog.webp" is a photo of a Chihuahua —
// the wrong file was uploaded when the breed library was built, and the
// French Bulldog breed page, breed cards and the pattern URL
// /api/assets/breeds/french-bulldog.webp all serve it. The corrected photo
// (a brindle French Bulldog, standing) was uploaded to R2 under the uploads
// key below; every read path is pointed at it instead:
//
// - lib/breeds.ts applies BREED_IMAGE_OVERRIDES to breed rows (page + cards)
// - server.ts /api/breeds applies it to the raw API response
// - server.ts asset delivery swaps the R2 key via BREED_ASSET_KEY_OVERRIDES
//
// Photo credit (CC BY 2.0): "French Bulldog brindle standing" by danny O.
// via Flickr / Wikimedia Commons — the breed page renders the credit line.

export interface BreedImageOverride {
  /** Corrected hero image URL (site-absolute path). */
  heroImage: string;
  /** R2 key holding the WRONG photo (used by the asset-delivery override). */
  replacesKey: string;
  credit?: { text: string; href: string };
}

export const BREED_IMAGE_OVERRIDES: Record<string, BreedImageOverride> = {
  "french-bulldog": {
    heroImage: "/api/assets/uploads/1794305354299-french-bulldog.webp",
    replacesKey: "breeds/french-bulldog.webp",
    credit: {
      text: "Photo: danny O. via Wikimedia Commons (CC BY 2.0)",
      href: "https://commons.wikimedia.org/wiki/File:French_Bulldog_brindle_standing.jpg",
    },
  },
};

interface BreedImageFields {
  slug: string;
  hero_image?: string | null;
  images?: string[];
}

export function applyBreedImageOverride<T extends BreedImageFields>(breed: T): T {
  const o = BREED_IMAGE_OVERRIDES[breed.slug];
  if (!o) return breed;
  const old = breed.hero_image;
  const images = Array.isArray(breed.images)
    ? breed.images.map((src) => (src === old ? o.heroImage : src))
    : breed.images;
  return { ...breed, hero_image: o.heroImage, images };
}

export function applyBreedImageOverrides<T extends BreedImageFields>(list: T[]): T[] {
  return list.map(applyBreedImageOverride);
}

/** Wrong R2 key -> corrected R2 key, for the asset-delivery handler. */
export const BREED_ASSET_KEY_OVERRIDES: Record<string, string> = Object.fromEntries(
  Object.values(BREED_IMAGE_OVERRIDES).map((o) => [
    o.replacesKey,
    o.heroImage.replace(/^\/api\/assets\//, ""),
  ]),
);
