/**
 * 요청 진입 시 공개 경로, 인증 리다이렉트, 홈 이동을 제어하는 Next.js Proxy 파일입니다.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ROUTES } from '@/constants/ROUTES';
import { buildLoginPath } from '@/utils/authRedirect';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;
const PUBLIC_PATH_PREFIXES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.BOARDS,
  '/api/oauth',
  '/oauth',
  '/reset-password',
  '/password-reset',
] as const;

function getAuthenticatedHomeRoute() {
  return TEAM_ID ? ROUTES.TEAM(TEAM_ID) : ROUTES.MY_HISTORY;
}

function isPublicPath(pathname: string) {
  return (
    pathname === ROUTES.HOME ||
    PUBLIC_PATH_PREFIXES.some((path) => pathname.startsWith(path))
  );
}

function getRedirectPath(request: NextRequest) {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export function proxy(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access-token')?.value;

  if (pathname === ROUTES.HOME && accessToken) {
    return NextResponse.redirect(
      new URL(getAuthenticatedHomeRoute(), request.url),
    );
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo: getRedirectPath(request),
        }),
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
