import { en } from '../locales/en';
import { zh, type MessageKey } from '../locales/zh';

export type Locale = 'zh' | 'en';
export type { MessageKey };

export const DEFAULT_LOCALE: Locale = 'zh';
export const LOCALES: Locale[] = ['zh', 'en'];
export const LOCALE_COOKIE = 'gx_locale';

const catalogs: Record<Locale, Record<MessageKey, string>> = { zh, en };

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'zh' || value === 'en';
}

export function getLocaleFromPath(pathname: string): Locale {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path === '/en' || path.startsWith('/en/')) return 'en';
  return 'zh';
}

/** Strip `/en` prefix; keep leading slash. */
export function stripLocalePrefix(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path === '/en') return '/';
  if (path.startsWith('/en/')) {
    const rest = path.slice(3);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return path;
}

/** Prefix path with locale (default zh has no prefix). */
export function withLocale(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'zh') return normalized === '' ? '/' : normalized;
  if (normalized === '/') return '/en/';
  return `/en${normalized}`;
}

/** Map current path to the other locale. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = stripLocalePrefix(pathname);
  return withLocale(target, bare);
}

export function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'zh-CN';
}

export function t(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  let text = catalogs[locale][key] ?? catalogs.zh[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
