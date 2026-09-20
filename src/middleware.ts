import { defineMiddleware } from 'astro:middleware';
import { getSessionUser, isProtectedPath } from './lib/auth';
import {
  getLocaleFromPath,
  LOCALE_COOKIE,
  isLocale,
  stripLocalePrefix,
  withLocale,
} from './lib/i18n';

const PUBLIC_AUTH_PREFIXES = ['/login', '/auth', '/en/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const locale = getLocaleFromPath(pathname);
  context.locals.locale = locale;

  let user = null;
  try {
    user = getSessionUser(context.cookies);
  } catch {
    // SESSION_SECRET missing during misconfigured deploy
  }
  if (user) context.locals.user = user;

  const bare = stripLocalePrefix(pathname);
  if (
    PUBLIC_AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    bare === '/login' ||
    bare.startsWith('/auth')
  ) {
    return next();
  }

  if (!isProtectedPath(pathname)) {
    return next();
  }

  if (!user) {
    const nextUrl = encodeURIComponent(pathname);
    const loginPath = withLocale(locale, '/login');
    return context.redirect(`${loginPath}?next=${nextUrl}`);
  }

  return next();
});

/** Persist locale preference when visitor hits a language-prefixed page. */
export function rememberLocaleCookie(
  cookies: import('astro').AstroCookies,
  locale: string,
): void {
  if (!isLocale(locale)) return;
  cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
  });
}
