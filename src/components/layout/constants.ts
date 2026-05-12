/**
 * 공통 레이아웃 인증 상태 계산에 사용하는 상수와 헬퍼입니다.
 */

import { ROUTES } from '@/constants/ROUTES';

export type LayoutCurrentUser = {
  email?: string;
  image?: string | null;
  name: string;
  teamName: string;
};

export const DEFAULT_LAYOUT_CURRENT_USER = {
  email: undefined,
  image: null,
  name: '사용자',
  teamName: '',
} satisfies LayoutCurrentUser;

export function isGuestLayoutPath(pathname: string | null) {
  return (
    pathname === ROUTES.LOGIN ||
    pathname === ROUTES.SIGNUP ||
    pathname?.startsWith(ROUTES.RESET_PASSWORD) === true ||
    pathname?.startsWith('/password-reset') === true ||
    pathname?.startsWith('/oauth/') === true
  );
}
