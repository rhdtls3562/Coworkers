/**
 * 팀 초대 토큰과 그룹 식별자로 팀 참여 링크를 생성하는 유틸입니다.
 */

import { ROUTES } from '@/constants/ROUTES';

type BuildJoinTeamLinkParams = {
  groupId?: string;
  token: string;
};

export function buildJoinTeamLink({ groupId, token }: BuildJoinTeamLinkParams) {
  const inviteQuery = new URLSearchParams({
    token,
  });

  if (groupId) {
    inviteQuery.set('groupId', groupId);
  }

  return `${ROUTES.JOIN_TEAM}?${inviteQuery.toString()}`;
}
