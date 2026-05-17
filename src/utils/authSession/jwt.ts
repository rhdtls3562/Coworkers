/** JWT 액세스 토큰을 디코딩하는 유틸 함수 파일입니다. */

import { isBrowser } from '@/utils/authSession/browser';

function decodeJwtPayload(accessToken: string) {
  if (!isBrowser()) {
    return null;
  }

  const [, encodedPayload] = accessToken.split('.');

  if (!encodedPayload) {
    return null;
  }

  const normalizedPayload = encodedPayload
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=');

  try {
    return JSON.parse(window.atob(normalizedPayload)) as {
      exp?: number;
    };
  } catch {
    return null;
  }
}

export function getAccessTokenExpirationTime(accessToken?: string | null) {
  if (!accessToken) {
    return null;
  }

  const payload = decodeJwtPayload(accessToken);

  if (typeof payload?.exp !== 'number') {
    return null;
  }

  return payload.exp * 1000;
}

export function isAccessTokenExpired(accessToken?: string | null) {
  const expirationTime = getAccessTokenExpirationTime(accessToken);

  if (!expirationTime) {
    return false;
  }

  return expirationTime <= Date.now();
}
