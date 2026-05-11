'use client';

/**
 * 현재 팀 라우트가 내 멤버십에 포함되는지 검사하고, 접근 불가 시 안전한 경로로 이동시키는 훅입니다.
 */

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import type { UserInfo } from '@/api/types';
import { resolveTeamRouteAccess } from '@/app/(service)/[teamid]/utils/teamRouteAccess';
import { useMeQuery } from '@/hooks/useUser';

type UseTeamRouteGuardParams = {
  emptyRoute?: string | null;
  teamId: string;
};

export default function useTeamRouteGuard({
  emptyRoute,
  teamId,
}: UseTeamRouteGuardParams) {
  const router = useRouter();
  const { data: meData, isLoading } = useMeQuery<UserInfo>();
  const access = resolveTeamRouteAccess(
    teamId,
    meData?.memberships,
    emptyRoute,
  );

  useEffect(() => {
    if (isLoading || access.isAccessible || !access.fallbackRoute) {
      return;
    }

    router.replace(access.fallbackRoute);
  }, [access.fallbackRoute, access.isAccessible, isLoading, router]);

  return {
    ...access,
    isLoading,
    meData,
  };
}
