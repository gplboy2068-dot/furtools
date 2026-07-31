import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { DEFAULT_LANGUAGE, NAMESPACES, SUPPORTED_LANGUAGES } from './i18n-config';

// Safe SSR / Client check
const isClient = typeof window !== 'undefined';

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LANGUAGE,
      supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
      defaultNS: 'common',
      ns: [...NAMESPACES],
      
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },

      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        lookupQuerystring: 'lang',
        lookupCookie: 'furtools_lang',
        lookupLocalStorage: 'furtools_lang',
        caches: ['cookie', 'localStorage'],
      },

      interpolation: {
        escapeValue: false, // React already escapes strings
      },

      react: {
        useSuspense: false, // Prevents hydration glitches in SSR frameworks
      },

      debug: false,
    });
}

/**
 * Synchronize document `lang` and `dir` (LTR/RTL) attribute whenever language changes
 */
if (isClient) {
  const updateHtmlAttributes = (lng: string) => {
    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lng) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = langConfig.code;
    document.documentElement.dir = langConfig.dir;
    if (langConfig.dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  };

  updateHtmlAttributes(i18n.language || DEFAULT_LANGUAGE);
  i18n.on('languageChanged', (lng) => {
    updateHtmlAttributes(lng);
  });
}

export default i18n;
