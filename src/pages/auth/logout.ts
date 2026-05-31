import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  clearSessionCookie(cookies);
  return redirect('/');
};
