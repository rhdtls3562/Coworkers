/**
 * 인증 전후 이동 경로를 안전하게 조합하는 유틸 파일입니다.
 */

import { ROUTES } from '@/constants/ROUTES';

const DUMMY_BASE_URL = 'https://coworkers.local';

type BuildLoginPathParams = {
  email?: string;
  redirectTo?: string | null;
};

function buildPathWithSearch(
  pathname: string,
  searchParams: Record<string, string | null | undefined>,
) {
  const url = new URL(pathname, DUMMY_BASE_URL);

  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    url.searchParams.set(key, value);
  });

  return `${url.pathname}${url.search}`;
}

export function getSafeRedirectTo(redirectTo?: string | null) {
  if (!redirectTo?.startsWith('/')) {
    return null;
  }

  return redirectTo.startsWith('//') ? null : redirectTo;
}

export function buildLoginPath({
  email,
  redirectTo,
}: BuildLoginPathParams = {}) {
  return buildPathWithSearch(ROUTES.LOGIN, {
    email,
    redirectTo: getSafeRedirectTo(redirectTo),
  });
}

export function buildSignupPath(redirectTo?: string | null) {
  return buildPathWithSearch(ROUTES.SIGNUP, {
    redirectTo: getSafeRedirectTo(redirectTo),
  });
}

export function buildOauthAuthorizePath(
  provider: string,
  redirectTo?: string | null,
) {
  return buildPathWithSearch(ROUTES.OAUTH_AUTHORIZE(provider), {
    redirectTo: getSafeRedirectTo(redirectTo),
  });
}

export function resolvePostAuthPath(
  teamId: string | undefined,
  redirectTo?: string | null,
) {
  return (
    getSafeRedirectTo(redirectTo) ??
    (teamId ? ROUTES.TEAM(teamId) : ROUTES.HOME)
  );
}
