import { isBrowser } from '@/utils/authSession/browser';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/authSession/constants';

export function getCookieValue(name: string) {
  if (!isBrowser()) {
    return null;
  }

  const key = `${name}=`;
  const cookie = document.cookie
    .split('; ')
    .find((cookieItem) => cookieItem.startsWith(key));

  return cookie?.slice(key.length) ?? null;
}

export function buildAccessTokenCookie(accessToken: string) {
  return `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}; path=/; SameSite=Lax`;
}

export function buildExpiredAccessTokenCookie() {
  return `${ACCESS_TOKEN_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
