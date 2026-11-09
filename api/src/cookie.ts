import { sessionLifetimeMs } from './sessions.ts';

export const sessionCookieName = 'love_session';

// Builds the Set-Cookie value for a new session. The cookie is HttpOnly (page
// scripts cannot read it), SameSite=Lax, and limited to the API. In production
// it is also Secure, so browsers send it over HTTPS only.
export function sessionCookie(token: string, secure: boolean): string {
  const parts = [
    `${sessionCookieName}=${token}`,
    'Path=/',
    `Max-Age=${Math.floor(sessionLifetimeMs / 1000)}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}
