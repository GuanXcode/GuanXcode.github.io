import type { APIRoute } from 'astro';
import { buildGitHubAuthorizeUrl } from '../../lib/auth';

export const prerender = false;

const STATE_COOKIE = 'gx_oauth_state';
const NEXT_COOKIE = 'gx_oauth_next';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const url = new URL(request.url);
    const nextParam = url.searchParams.get('next') ?? '/me';
    const safeNext =
      nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/me';

    const state = crypto.randomUUID();
    cookies.set(NEXT_COOKIE, safeNext, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 600,
    });
    cookies.set(STATE_COOKIE, state, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 600,
    });
    return redirect(buildGitHubAuthorizeUrl(request, state));
  } catch {
    return redirect('/login?error=config');
  }
};
