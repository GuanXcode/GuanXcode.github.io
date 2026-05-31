import type { APIRoute } from 'astro';
import {
  exchangeGitHubCode,
  isAllowedLogin,
  setSessionCookie,
} from '../../lib/auth';

export const prerender = false;

const STATE_COOKIE = 'gx_oauth_state';
const NEXT_COOKIE = 'gx_oauth_next';

export const GET: APIRoute = async ({ request, url, cookies, redirect }) => {
  const error = url.searchParams.get('error');
  if (error) return redirect('/login?error=oauth_denied');

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = cookies.get(STATE_COOKIE)?.value;
  cookies.delete(STATE_COOKIE, { path: '/' });

  if (!code || !state || !savedState || state !== savedState) {
    return redirect('/login?error=invalid_state');
  }

  try {
    const user = await exchangeGitHubCode(request, code);
    if (!isAllowedLogin(user.login)) {
      return redirect('/login?error=not_allowed');
    }
    setSessionCookie(cookies, user);
    const next = cookies.get(NEXT_COOKIE)?.value ?? '/me';
    cookies.delete(NEXT_COOKIE, { path: '/' });
    const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/me';
    return redirect(safeNext);
  } catch {
    return redirect('/login?error=oauth_failed');
  }
};
