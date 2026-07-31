import { useEffect, useState } from 'react';
import i18n from './i18n';
import { DEFAULT_LANGUAGE } from './i18n-config';

export type MultilingualField = Record<string, any> | string | undefined | null;

/**
 * Resolves a dynamic localized field from database storage (e.g. JSONB field or fallback string)
 */
export function getLocalizedField(
  field: MultilingualField,
  targetLang?: string
): string {
  if (!field) return '';
  if (typeof field === 'string') return field;

  const currentLang = targetLang || i18n.language || DEFAULT_LANGUAGE;

  // 1. Exact match for current language
  if (field[currentLang]) {
    return String(field[currentLang]);
  }

  // 2. Primary language tag match (e.g. 'zh' for 'zh-CN')
  const primaryLang = currentLang.split('-')[0];
  if (field[primaryLang]) {
    return String(field[primaryLang]);
  }

  // 3. Fallback to English
  if (field[DEFAULT_LANGUAGE]) {
    return String(field[DEFAULT_LANGUAGE]);
  }

  // 4. Return any first available translation string
  const availableKeys = Object.keys(field);
  if (availableKeys.length > 0 && field[availableKeys[0]]) {
    return String(field[availableKeys[0]]);
  }

  return '';
}

/**
 * Overlays translated fields from a record onto the main record.
 * Handles both JSONB fields (name: { en: '...', es: '...' })
 * AND row-level `translations` object (record.translations = { es: { name: '...' } }).
 */
export function getLocalizedRecord<T extends Record<string, any>>(
  record: T | null | undefined,
  targetLang?: string
): T | null {
  if (!record) return null;
  const currentLang = targetLang || i18n.language || DEFAULT_LANGUAGE;
  const primaryLang = currentLang.split('-')[0];

  const result: Record<string, any> = { ...record };

  // 1. Check if record has a `translations` object (e.g. record.translations['es'])
  if (record.translations && typeof record.translations === 'object') {
    const langObj =
      record.translations[currentLang] ||
      record.translations[primaryLang] ||
      record.translations[DEFAULT_LANGUAGE];
    if (langObj && typeof langObj === 'object') {
      for (const [k, v] of Object.entries(langObj)) {
        if (v !== undefined && v !== null && v !== '') {
          result[k] = v;
        }
      }
    }
  }

  // 2. Check for individual JSONB fields (e.g. title: { en: '...', es: '...' })
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (
      val &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      (val.en !== undefined || val.es !== undefined || val[currentLang] !== undefined)
    ) {
      result[key] = getLocalizedField(val, currentLang);
    }
  }

  return result as T;
}

/**
 * React hook that returns the active language code and updates component automatically on language change
 */
export function useActiveLanguage(): string {
  const [lang, setLang] = useState(i18n.language || DEFAULT_LANGUAGE);

  useEffect(() => {
    const onChange = (newLang: string) => setLang(newLang);
    i18n.on('languageChanged', onChange);

    const onCustomEvent = () => {
      setLang(i18n.language || DEFAULT_LANGUAGE);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('furtools_lang_changed', onCustomEvent);
    }

    return () => {
      i18n.off('languageChanged', onChange);
      if (typeof window !== 'undefined') {
        window.removeEventListener('furtools_lang_changed', onCustomEvent);
      }
    };
  }, []);

  return lang;
}

/**
 * React hook that returns a localized record and re-renders component automatically when language changes
 */
export function useLocalizedRecord<T extends Record<string, any>>(record: T | null | undefined): T | null {
  const currentLang = useActiveLanguage();
  return getLocalizedRecord(record, currentLang);
}

/**
 * Formats a localized object for saving to DB
 */
export function createMultilingualPayload(
  currentObj: Record<string, string> = {},
  lang: string,
  value: string
): Record<string, string> {
  return {
    ...currentObj,
    [lang]: value,
  };
}
