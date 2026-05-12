import { ROLE } from '@/app/(service)/[teamid]/constants';

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** 사용자 역할 - 관리자 또는 일반 멤버 */
export type RoleProps = (typeof ROLE)[number];
