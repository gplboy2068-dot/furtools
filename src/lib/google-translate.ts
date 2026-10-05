/**
 * Language manager for FurTools (native i18next translations).
 * Google Translate widget was removed — es/de/en use hand-written locale files.
 */
import i18n from "./i18n";
import { SUPPORTED_LANGUAGES } from "./i18n-config";

/** Languages with complete native translations. */
export const NATIVE_LANGUAGES = ["en", "es", "de"] as const;

const STORAGE_KEY = "furtools_lang";

function isNative(code: string): boolean {
  return (NATIVE_LANGUAGES as readonly string[]).includes(code);
}

export function getActiveLanguage(): string {
  if (typeof window === "undefined") return "en";

  // 1. ?lang= query param
  try {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param && isNative(param)) return param;
  } catch {
    /* ignore */
  }

  // 2. i18next current language
  const current = i18n.language?.split("-")[0];
  if (current && isNative(current)) return current;

  // 3. saved preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isNative(saved)) return saved;
  } catch {
    /* ignore */
  }
  const cookie = document.cookie.match(/(?:^|;\s*)furtools_lang=([a-z-]+)/i);
  if (cookie && isNative(cookie[1])) return cookie[1];

  return "en";
}

/** Switch the site language (native translations only). */
export function setWebsiteLanguage(langCode: string): void {
  if (typeof window === "undefined") return;
  const code = isNative(langCode) ? langCode : "en";

  // 1. Persist preference (i18next detector also reads these)
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
  document.cookie = `furtools_lang=${code}; path=/; max-age=31536000`;

  // 2. Clear any stale Google Translate cookies from the old system
  const past = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  for (const domain of [host, `.${host}`]) {
    document.cookie = `googtrans=; path=/; domain=${domain}; expires=${past}`;
  }
  document.cookie = `googtrans=; path=/; expires=${past}`;

  // 3. Update URL param + switch i18next
  const url = new URL(window.location.href);
  if (code === "en") url.searchParams.delete("lang");
  else url.searchParams.set("lang", code);
  window.history.replaceState({}, "", url.toString());

  if (i18n.language !== code) {
    i18n.changeLanguage(code);
  } else {
    // force re-render for same-language clicks
    window.dispatchEvent(new CustomEvent("furtools:lang", { detail: code }));
  }
}

/** No-op kept for backwards compatibility (Google Translate removed). */
export function initGoogleTranslate(): void {
  /* Google Translate widget disabled — native translations only. */
}
