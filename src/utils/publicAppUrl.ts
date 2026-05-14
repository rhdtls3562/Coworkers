/**
 * 외부 공유와 메타데이터에 사용할 공개 앱 기준 주소를 관리합니다.
 */

const DEFAULT_PUBLIC_APP_URL = 'https://coworkers-blond.vercel.app';

function isLocalhostUrl(url: string) {
  return (
    url.includes('://localhost') ||
    url.includes('://127.0.0.1') ||
    url.includes('://0.0.0.0')
  );
}

export function resolvePublicAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.NEXTAUTH_URL && !isLocalhostUrl(process.env.NEXTAUTH_URL)) {
    return process.env.NEXTAUTH_URL;
  }

  return DEFAULT_PUBLIC_APP_URL;
}

export function resolveClientPublicAppBaseUrl(fallbackOrigin?: string) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (fallbackOrigin && !isLocalhostUrl(fallbackOrigin)) {
    return fallbackOrigin;
  }

  return DEFAULT_PUBLIC_APP_URL;
}
