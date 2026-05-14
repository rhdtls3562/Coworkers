/**
 * 클라이언트에서 인증 세션을 저장하고 읽는 유틸입니다.
 */

import { isBrowser } from '@/utils/authSession/browser';
import {
  ACCESS_TOKEN_COOKIE_KEY,
  AUTH_SESSION_CHANGE_EVENT,
  AUTH_SESSION_STORAGE_KEY,
} from '@/utils/authSession/constants';
import {
  buildAccessTokenCookie,
  buildExpiredAccessTokenCookie,
  getCookieValue,
} from '@/utils/authSession/cookies';
import {
  getAccessTokenExpirationTime,
  isAccessTokenExpired,
} from '@/utils/authSession/jwt';
import { extractAuthSession } from '@/utils/authSession/parser';
import type {
  AuthSession,
  AuthSessionChangeReason,
  AuthSessionUser,
} from '@/utils/authSession/types';

function emitAuthSessionChange(reason: AuthSessionChangeReason) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_CHANGE_EVENT, {
      detail: {
        reason,
      },
    }),
  );
}

function persistAuthSession(
  session: AuthSession,
  reason: AuthSessionChangeReason,
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
  document.cookie = buildAccessTokenCookie(session.accessToken);
  emitAuthSessionChange(reason);
}

export function getAuthSession() {
  if (!isBrowser()) {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    return extractAuthSession(JSON.parse(storedSession));
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  persistAuthSession(session, 'saved');
}

export function clearAuthSession(reason: AuthSessionChangeReason = 'manual') {
  if (!isBrowser()) {
    return;
  }

  const hasStoredSession =
    window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) !== null ||
    Boolean(getCookieValue(ACCESS_TOKEN_COOKIE_KEY));

  if (!hasStoredSession) {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  document.cookie = buildExpiredAccessTokenCookie();
  emitAuthSessionChange(reason);
}

export function getStoredAccessToken() {
  const session = getAuthSession();

  if (session?.accessToken) {
    return session.accessToken;
  }

  return getCookieValue(ACCESS_TOKEN_COOKIE_KEY);
}

export function getStoredRefreshToken() {
  const session = getAuthSession();
  return session?.refreshToken ?? null;
}

export function setStoredAccessToken(accessToken: string) {
  const session = getAuthSession();
  if (!session) return;

  persistAuthSession({ ...session, accessToken }, 'refreshed');
}

export function hasAuthSession() {
  const accessToken = getStoredAccessToken();

  if (!accessToken) {
    return false;
  }

  return !isAccessTokenExpired(accessToken);
}

export function subscribeAuthSessionChange(
  onChange: (reason: AuthSessionChangeReason) => void,
) {
  if (!isBrowser()) {
    return () => {};
  }

  const handleChange = (event: Event) => {
    const reason =
      event instanceof CustomEvent && typeof event.detail?.reason === 'string'
        ? (event.detail.reason as AuthSessionChangeReason)
        : 'manual';

    onChange(reason);
  };

  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, handleChange);
  return () => {
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, handleChange);
  };
}

export {
  extractAuthSession,
  getAccessTokenExpirationTime,
  isAccessTokenExpired,
};
export type { AuthSession, AuthSessionChangeReason, AuthSessionUser };
