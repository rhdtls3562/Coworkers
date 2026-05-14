/**
 * 공유 링크, 메일 링크처럼 외부에서 다시 열어야 하는 URL의 기준 주소를 관리합니다.
 */

import { resolveClientPublicAppBaseUrl } from '@/utils/publicAppUrl';

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function resolveShareableAppBaseUrl(fallbackOrigin?: string) {
  return normalizeBaseUrl(resolveClientPublicAppBaseUrl(fallbackOrigin));
}

export function buildShareableAppUrl(
  pathname: string,
  fallbackOrigin?: string,
) {
  const baseUrl = resolveShareableAppBaseUrl(fallbackOrigin);

  if (!baseUrl) {
    return null;
  }

  return new URL(pathname, baseUrl).toString();
}
