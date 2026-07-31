import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { DEFAULT_LANGUAGE, NAMESPACES, SUPPORTED_LANGUAGES } from './i18n-config';
import { enResources } from './i18n-en-resources';

const isClient = typeof window !== 'undefined';

if (!i18n.isInitialized) {
  const instance = i18n;

  if (isClient) {
    instance.use(HttpBackend).use(LanguageDetector);
  }

  instance.use(initReactI18next).init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    defaultNS: 'common',
    ns: [...NAMESPACES],
    
    // Baseline resources preloaded synchronously for fail-safe SSR & zero hydration errors
    resources: {
      en: enResources,
    },

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
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    debug: false,
  });
}

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
