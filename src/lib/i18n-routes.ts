import i18n from './i18n';
import { SUPPORTED_LANGUAGES } from './i18n-config';

// Map of canonical tool/page slugs to localized slugs
export const ROUTE_SLUG_MAP: Record<string, Record<string, string>> = {
  'dog-age-calculator': {
    en: 'dog-age-calculator',
    es: 'calculadora-edad-perro',
    fr: 'calcul-age-chien',
    de: 'hundealter-rechner',
    it: 'calcolatore-eta-cane',
    pt: 'calculadora-idade-cao',
    ar: 'hasibat-umr-al-kalb',
  },
  'cat-age-calculator': {
    en: 'cat-age-calculator',
    es: 'calculadora-edad-gato',
    fr: 'calcul-age-chat',
    de: 'katzenalter-rechner',
    it: 'calcolatore-eta-gatto',
    pt: 'calculadora-idade-gato',
    ar: 'hasibat-umr-al-qitt',
  },
  'pet-food-calculator': {
    en: 'pet-food-calculator',
    es: 'calculadora-comida-mascotas',
    fr: 'calculateur-nourriture-animaux',
    de: 'futterrechner-haustiere',
  },
};

/**
 * Get localized slug for a page or tool
 */
export function getLocalizedSlug(slug: string, targetLang?: string): string {
  const lang = targetLang || i18n.language || 'en';
  if (ROUTE_SLUG_MAP[slug] && ROUTE_SLUG_MAP[slug][lang]) {
    return ROUTE_SLUG_MAP[slug][lang];
  }
  return slug;
}

/**
 * Builds a clean localized URL path with locale prefix (e.g. /es/breeds/gato-persa or /fr/tools/dog-age-calculator)
 */
export function buildLocalizedUrl(pathname: string, targetLang: string): string {
  const clean = pathname.replace(/^\/(?:[a-z]{2}(?:-[A-Z]{2})?)/i, '').replace(/^\/+/, '');
  const prefix = targetLang === 'en' ? 'en' : targetLang.toLowerCase();
  return `/${prefix}${clean ? `/${clean}` : ''}`;
}

/**
 * Generate hreflang tags array for HTML head metadata using prefix route architecture
 */
export function generateHreflangTags(currentPath: string) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.furtools.com';

  // Extract clean path (stripping existing locale prefix if any)
  const cleanPath = currentPath.replace(/^\/(?:[a-z]{2}(?:-[A-Z]{2})?)/i, '').replace(/^\/+/, '');

  const tags = SUPPORTED_LANGUAGES.filter((l) => l.isEnabled).map((lang) => {
    const langCode = lang.code.toLowerCase();
    const localizedPath = `${baseUrl}/${langCode}${cleanPath ? `/${cleanPath}` : ''}`;

    return {
      rel: 'alternate',
      hrefLang: lang.code,
      href: localizedPath,
    };
  });

  // Add x-default pointing to English /en/ prefix
  tags.push({
    rel: 'alternate',
    hrefLang: 'x-default',
    href: `${baseUrl}/en${cleanPath ? `/${cleanPath}` : ''}`,
  });

  return tags;
}
