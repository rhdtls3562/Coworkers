/**
 * 공유 링크, 메일 링크처럼 외부에서 다시 열어야 하는 URL의 기준 주소를 관리합니다.
 */

const PUBLIC_APP_BASE_URL =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? null;

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function resolveShareableAppBaseUrl(fallbackOrigin?: string) {
  if (PUBLIC_APP_BASE_URL) {
    return normalizeBaseUrl(PUBLIC_APP_BASE_URL);
  }

  if (!fallbackOrigin) {
    return null;
  }

  return normalizeBaseUrl(fallbackOrigin);
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
