/**
 * OAuth 콜백 URL을 서버/클라이언트에서 같은 기준으로 만들기 위한 유틸입니다.
 */

import { ROUTES } from '@/constants/ROUTES';

const OAUTH_BASE_URL =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? null;

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function resolveOauthBaseUrl(fallbackOrigin?: string) {
  return fallbackOrigin ?? OAUTH_BASE_URL ?? null;
}

export function buildOauthCallbackUrl(
  provider: string,
  fallbackOrigin?: string,
) {
  const baseUrl = resolveOauthBaseUrl(fallbackOrigin);

  if (!baseUrl) {
    return null;
  }

  return new URL(
    ROUTES.OAUTH_CALLBACK(provider),
    normalizeBaseUrl(baseUrl),
  ).toString();
}
