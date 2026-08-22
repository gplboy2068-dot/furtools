/**
 * Google Translate Integration Engine for FurTools
 * Seamlessly translates 100% of website content (all 224+ tools, calculators,
 * AI assistants, blogs, and UI components) into 20+ languages.
 */

import { SUPPORTED_LANGUAGES, LanguageConfig } from './i18n-config';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Map internal language codes to Google Translate codes
const GOOGLE_LANG_MAP: Record<string, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  nl: 'nl',
  pl: 'pl',
  tr: 'tr',
  ru: 'ru',
  ar: 'ar',
  hi: 'hi',
  ja: 'ja',
  ko: 'ko',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  th: 'th',
  vi: 'vi',
  id: 'id',
  ms: 'ms',
};

export function getActiveLanguage(): string {
  if (typeof window === 'undefined') return 'en';
  
  // 1. Check URL param ?lang=
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  if (paramLang && GOOGLE_LANG_MAP[paramLang]) {
    return paramLang;
  }

  // 2. Check localStorage
  const saved = localStorage.getItem('furtools_lang');
  if (saved && GOOGLE_LANG_MAP[saved]) {
    return saved;
  }

  // 3. Check googtrans cookie
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-zA-Z\-]+)/);
  if (match && match[1]) {
    const lang = Object.keys(GOOGLE_LANG_MAP).find(
      (k) => GOOGLE_LANG_MAP[k].toLowerCase() === match[1].toLowerCase()
    );
    if (lang) return lang;
  }

  return 'en';
}

export function setWebsiteLanguage(langCode: string) {
  if (typeof window === 'undefined') return;

  const targetGoogleCode = GOOGLE_LANG_MAP[langCode] || 'en';
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

  // 1. Save preferences
  localStorage.setItem('furtools_lang', langCode);

  // 2. Set Google Translate cookies across all subdomains and paths
  const domain = window.location.hostname;
  const cookieValue = targetGoogleCode === 'en' ? '' : `/en/${targetGoogleCode}`;
  const expires = targetGoogleCode === 'en' ? 'Thu, 01 Jan 1970 00:00:00 GMT' : 'Fri, 31 Dec 2030 23:59:59 GMT';

  document.cookie = `googtrans=${cookieValue}; path=/; expires=${expires}`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain}; expires=${expires}`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}; expires=${expires}`;

  // 3. Update HTML lang and direction
  document.documentElement.lang = langConfig.code;
  document.documentElement.dir = langConfig.dir;
  if (langConfig.dir === 'rtl') {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }

  // 4. Update URL without full page reload if possible
  const url = new URL(window.location.href);
  if (langCode === 'en') {
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', langCode);
  }
  window.history.replaceState({}, '', url.toString());

  // 5. Trigger Google Translate combo box or reload DOM translation
  const selectElem = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (selectElem) {
    selectElem.value = targetGoogleCode;
    selectElem.dispatchEvent(new Event('change'));
  } else {
    // If widget not ready yet, reload to apply cookie immediately
    window.location.reload();
  }
}

export function initGoogleTranslate() {
  if (typeof window === 'undefined') return;

  // Define global initialization callback
  window.googleTranslateElementInit = () => {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: Object.values(GOOGLE_LANG_MAP).join(','),
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
        },
        'google_translate_element'
      );

      // Auto-trigger active language if non-English
      const activeLang = getActiveLanguage();
      if (activeLang && activeLang !== 'en') {
        setTimeout(() => {
          const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
          if (select) {
            select.value = GOOGLE_LANG_MAP[activeLang] || activeLang;
            select.dispatchEvent(new Event('change'));
          }
        }, 300);
      }
    }
  };

  // Inject Google Translate script if not already present
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }
}
