/** 레이아웃 인증 상태를 가공하는 헬퍼 유틸 함수 파일입니다. */

import {
  DEFAULT_LAYOUT_CURRENT_USER,
  type LayoutCurrentUser,
} from '@/components/layout/constants';
import type { SidebarTeam } from '@/components/layout/sidebar/types';
import type {
  LayoutMeResponse,
  LayoutSessionFallbackUser,
} from '@/components/layout/types/auth';
import { getAuthSession } from '@/utils/authSession';

export function getSessionFallbackUser(): LayoutSessionFallbackUser {
  const session = getAuthSession();

  return {
    email: session?.user?.email,
    image: session?.user?.image,
    nickname: session?.user?.nickname,
    teamName: session?.user?.teamName,
  };
}

function getDisplayName(...candidates: Array<string | undefined>) {
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const trimmedCandidate = candidate.trim();

    if (!trimmedCandidate) {
      continue;
    }

    return trimmedCandidate;
  }

  return DEFAULT_LAYOUT_CURRENT_USER.name;
}

function getTeamIdFromPathname(pathname: string | null) {
  if (!pathname) {
    return null;
  }

  const [firstSegment] = pathname.split('/').filter(Boolean);

  if (
    !firstSegment ||
    firstSegment === 'boards' ||
    firstSegment === 'myhistory' ||
    firstSegment === 'mypage' ||
    firstSegment === 'addteam' ||
    firstSegment === 'jointeam' ||
    firstSegment === 'login' ||
    firstSegment === 'signup' ||
    firstSegment === 'oauth'
  ) {
    return null;
  }

  return firstSegment;
}

export function getCurrentUser(
  pathname: string | null,
  meData: LayoutMeResponse | undefined,
  teams: SidebarTeam[],
): LayoutCurrentUser {
  const sessionFallbackUser = getSessionFallbackUser();
  const currentPathTeamId = getTeamIdFromPathname(pathname);
  const currentPathTeam = teams.find((team) => team.id === currentPathTeamId);
  const firstTeam = teams[0];

  return {
    email: meData?.email ?? sessionFallbackUser.email,
    image: meData?.image ?? sessionFallbackUser.image ?? null,
    name: getDisplayName(meData?.nickname, sessionFallbackUser.nickname),
    teamName:
      currentPathTeam?.name ??
      sessionFallbackUser.teamName ??
      firstTeam?.name ??
      DEFAULT_LAYOUT_CURRENT_USER.teamName,
  };
}

export function getProfileTeamName(teams: SidebarTeam[]) {
  if (teams.length === 0) {
    return undefined;
  }

  const [firstJoinedTeam] = [...teams].sort((teamA, teamB) => {
    const teamATime = teamA.createdAt ? new Date(teamA.createdAt).getTime() : 0;
    const teamBTime = teamB.createdAt ? new Date(teamB.createdAt).getTime() : 0;

    return teamATime - teamBTime;
  });

  return firstJoinedTeam?.name;
}
