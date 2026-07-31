import i18n from './i18n';
import { DEFAULT_LANGUAGE } from './i18n-config';

export type MultilingualField = Record<string, string> | string | undefined | null;

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
    return field[currentLang];
  }

  // 2. Primary language tag match (e.g. 'zh' for 'zh-CN')
  const primaryLang = currentLang.split('-')[0];
  if (field[primaryLang]) {
    return field[primaryLang];
  }

  // 3. Fallback to English
  if (field[DEFAULT_LANGUAGE]) {
    return field[DEFAULT_LANGUAGE];
  }

  // 4. Return any first available translation string
  const availableKeys = Object.keys(field);
  if (availableKeys.length > 0 && field[availableKeys[0]]) {
    return field[availableKeys[0]];
  }

  return '';
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
