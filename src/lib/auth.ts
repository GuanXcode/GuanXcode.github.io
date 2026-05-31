import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

export const SESSION_COOKIE = 'gx_session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  login: string;
  name: string;
  avatar: string;
}

function getSecret(): string {
  const secret = import.meta.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not configured');
  return secret;
}

export function getAllowedLogins(): string[] {
  const raw = import.meta.env.ALLOWED_GITHUB_USERS ?? 'GuanXcode';
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedLogin(login: string): boolean {
  return getAllowedLogins().includes(login.toLowerCase());
}

function sign(data: string): string {
  return createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function createSessionToken(user: SessionUser): string {
  const payload = Buffer.from(
    JSON.stringify({ ...user, exp: Date.now() + SESSION_MAX_AGE_SEC * 1000 }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function parseSessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  try {
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionUser & {
      exp: number;
    };
    if (!data.login || !data.exp || Date.now() > data.exp) return null;

    return { login: data.login, name: data.name, avatar: data.avatar };
  } catch {
    return null;
  }
}

export function getSessionUser(cookies: AstroCookies): SessionUser | null {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const user = parseSessionToken(token);
  if (!user || !isAllowedLogin(user.login)) return null;
  return user;
}

export function setSessionCookie(cookies: AstroCookies, user: SessionUser): void {
  cookies.set(SESSION_COOKIE, createSessionToken(user), {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function getOAuthConfig(request: Request) {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set');
  }
  const origin = new URL(request.url).origin;
  return {
    clientId,
    clientSecret,
    redirectUri: `${origin}/auth/callback`,
  };
}

export function buildGitHubAuthorizeUrl(request: Request, state: string): string {
  const { clientId, redirectUri } = getOAuthConfig(request);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user',
    state,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeGitHubCode(
  request: Request,
  code: string,
): Promise<SessionUser> {
  const { clientId, clientSecret, redirectUri } = getOAuthConfig(request);

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error ?? 'Failed to exchange OAuth code');
  }

  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenData.access_token}`,
      'User-Agent': 'guanxcode-github-io',
    },
  });

  const ghUser = (await userRes.json()) as {
    login?: string;
    name?: string | null;
    avatar_url?: string;
    message?: string;
  };

  if (!userRes.ok || !ghUser.login) {
    throw new Error(ghUser.message ?? 'Failed to fetch GitHub user');
  }

  return {
    login: ghUser.login,
    name: ghUser.name ?? ghUser.login,
    avatar: ghUser.avatar_url ?? '',
  };
}

export const PROTECTED_PREFIXES = ['/me', '/experience', '/projects', '/works'];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
