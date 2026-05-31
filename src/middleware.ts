import { defineMiddleware } from 'astro:middleware';
import { getSessionUser, isProtectedPath } from './lib/auth';

const PUBLIC_AUTH_PREFIXES = ['/login', '/auth'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  let user = null;
  try {
    user = getSessionUser(context.cookies);
  } catch {
    // SESSION_SECRET missing during misconfigured deploy
  }
  if (user) context.locals.user = user;

  if (PUBLIC_AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return next();
  }

  if (!isProtectedPath(pathname)) {
    return next();
  }

  if (!user) {
    const nextUrl = encodeURIComponent(pathname);
    return context.redirect(`/login?next=${nextUrl}`);
  }

  return next();
});
