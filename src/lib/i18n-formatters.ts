import i18n from './i18n';

/**
 * Format date based on current active locale or specified locale
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale?: string
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const currentLocale = locale || i18n.language || 'en';
  try {
    return new Intl.DateTimeFormat(currentLocale, options).format(d);
  } catch {
    return new Intl.DateTimeFormat('en', options).format(d);
  }
}

/**
 * Format relative time (e.g. "3 days ago", "in 2 hours")
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale?: string
): string {
  const currentLocale = locale || i18n.language || 'en';
  try {
    const rtf = new Intl.RelativeTimeFormat(currentLocale, { numeric: 'auto' });
    return rtf.format(value, unit);
  } catch {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    return rtf.format(value, unit);
  }
}

/**
 * Format number based on current locale
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale?: string
): string {
  const currentLocale = locale || i18n.language || 'en';
  try {
    return new Intl.NumberFormat(currentLocale, options).format(value);
  } catch {
    return new Intl.NumberFormat('en', options).format(value);
  }
}

/**
 * Format currency with locale-aware symbols
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale?: string
): string {
  const currentLocale = locale || i18n.language || 'en';
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

/**
 * Format weight & distance units (Metric vs Imperial)
 */
export function formatWeight(
  kgValue: number,
  unitSystem: 'metric' | 'imperial' = 'metric',
  locale?: string
): string {
  const currentLocale = locale || i18n.language || 'en';
  if (unitSystem === 'imperial') {
    const lbs = kgValue * 2.20462;
    return `${formatNumber(Math.round(lbs * 10) / 10, undefined, currentLocale)} lbs`;
  }
  return `${formatNumber(Math.round(kgValue * 10) / 10, undefined, currentLocale)} kg`;
}

export function formatLength(
  cmValue: number,
  unitSystem: 'metric' | 'imperial' = 'metric',
  locale?: string
): string {
  const currentLocale = locale || i18n.language || 'en';
  if (unitSystem === 'imperial') {
    const inches = cmValue * 0.393701;
    return `${formatNumber(Math.round(inches * 10) / 10, undefined, currentLocale)} in`;
  }
  return `${formatNumber(Math.round(cmValue * 10) / 10, undefined, currentLocale)} cm`;
}
