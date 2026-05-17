/** 앱 전역에서 사용하는 공통 TypeScript 타입 정의 파일입니다. */

import { ROLE } from '@/app/(service)/[teamid]/constants';

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 사용자 역할 - 관리자 또는 일반 멤버 */
export type RoleProps = (typeof ROLE)[number];
