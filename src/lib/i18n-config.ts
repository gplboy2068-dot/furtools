export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  isRTL: boolean;
  isEnabled: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸', isRTL: false, isEnabled: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸', isRTL: false, isEnabled: true },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷', isRTL: false, isEnabled: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪', isRTL: false, isEnabled: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', flag: '🇮🇹', isRTL: false, isEnabled: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', flag: '🇵🇹', isRTL: false, isEnabled: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr', flag: '🇳🇱', isRTL: false, isEnabled: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr', flag: '🇵🇱', isRTL: false, isEnabled: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', flag: '🇹🇷', isRTL: false, isEnabled: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺', isRTL: false, isEnabled: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦', isRTL: true, isEnabled: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳', isRTL: false, isEnabled: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', flag: '🇯🇵', isRTL: false, isEnabled: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr', flag: '🇰🇷', isRTL: false, isEnabled: true },
  { code: 'zh-CN', name: 'Chinese Simplified', nativeName: '简体中文', dir: 'ltr', flag: '🇨🇳', isRTL: false, isEnabled: true },
  { code: 'zh-TW', name: 'Chinese Traditional', nativeName: '繁體中文', dir: 'ltr', flag: '🇹🇼', isRTL: false, isEnabled: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr', flag: '🇹🇭', isRTL: false, isEnabled: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', flag: '🇻🇳', isRTL: false, isEnabled: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', flag: '🇮🇩', isRTL: false, isEnabled: true },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', flag: '🇲🇾', isRTL: false, isEnabled: true },
];

export const DEFAULT_LANGUAGE = 'en';

export const NAMESPACES = [
  'common',
  'home',
  'tools',
  'blog',
  'breed',
  'dashboard',
  'admin',
  'errors',
  'forms',
  'faq',
  'notifications',
] as const;

export type TranslationNamespace = typeof NAMESPACES[number];

export function isValidLocale(code: string): boolean {
  if (!code) return false;
  const clean = code.toLowerCase();
  return SUPPORTED_LANGUAGES.some(
    (l) => l.isEnabled && (l.code.toLowerCase() === clean || l.code.split('-')[0].toLowerCase() === clean)
  );
}

export function getLanguageConfig(code: string): LanguageConfig {
  const found = SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === code.toLowerCase() || l.code.split('-')[0].toLowerCase() === code.toLowerCase()
  );
  return found || SUPPORTED_LANGUAGES[0];
}

export function extractLocaleFromPath(pathname: string): { locale: string; cleanPath: string } {
  if (!pathname) return { locale: DEFAULT_LANGUAGE, cleanPath: '/' };

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return { locale: DEFAULT_LANGUAGE, cleanPath: '/' };

  const firstSeg = segments[0].toLowerCase();
  const match = SUPPORTED_LANGUAGES.find(
    (l) => l.isEnabled && (l.code.toLowerCase() === firstSeg || l.code.split('-')[0].toLowerCase() === firstSeg)
  );

  if (match) {
    const cleanSegments = segments.slice(1);
    const cleanPath = cleanSegments.length ? `/${cleanSegments.join('/')}` : '/';
    return { locale: match.code, cleanPath };
  }

  return { locale: DEFAULT_LANGUAGE, cleanPath: pathname };
}
