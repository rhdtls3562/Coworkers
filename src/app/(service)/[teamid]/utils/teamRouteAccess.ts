/**
 * 팀 라우트 접근 가능 여부와 이탈 후 이동 경로를 계산하는 유틸 파일입니다.
 */

import { ROUTES } from '@/constants/ROUTES';

type TeamMembershipLike = {
  groupId: number | string;
};

type TeamRouteAccessResult = {
  fallbackRoute: string | null;
  hasMemberships: boolean;
  isAccessible: boolean;
};

export const NO_GROUP_TEAM_ID = 'nogroup';
export const NO_GROUP_ROUTE = ROUTES.TEAM(NO_GROUP_TEAM_ID);

export function resolveTeamRouteAccess(
  teamId: string,
  memberships?: readonly TeamMembershipLike[],
  emptyRoute: string | null = NO_GROUP_ROUTE,
): TeamRouteAccessResult {
  const safeMemberships = memberships ?? [];

  if (safeMemberships.length === 0) {
    if (teamId === NO_GROUP_TEAM_ID) {
      return {
        fallbackRoute: null,
        hasMemberships: false,
        isAccessible: true,
      };
    }

    return {
      fallbackRoute: emptyRoute,
      hasMemberships: false,
      isAccessible: false,
    };
  }

  const isAccessible = safeMemberships.some(
    (membership) => String(membership.groupId) === teamId,
  );

  if (isAccessible) {
    return {
      fallbackRoute: null,
      hasMemberships: true,
      isAccessible: true,
    };
  }

  return {
    fallbackRoute: ROUTES.TEAM(String(safeMemberships[0].groupId)),
    hasMemberships: true,
    isAccessible: false,
  };
}

export function resolveTeamExitRoute(
  currentTeamId: string,
  memberships?: readonly TeamMembershipLike[],
) {
  const nextMembership = memberships?.find(
    (membership) => String(membership.groupId) !== currentTeamId,
  );

  return nextMembership
    ? ROUTES.TEAM(String(nextMembership.groupId))
    : NO_GROUP_ROUTE;
}
