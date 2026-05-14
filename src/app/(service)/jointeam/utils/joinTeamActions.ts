/**
 * 팀 참여 성공, 중복 참여, 링크 수락 요청과 관련된 액션 유틸 모음입니다.
 */

import { useRouter } from 'next/navigation';

import { extractInvitationToken } from '@/app/(service)/jointeam/utils/extractInvitationToken';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useAcceptTeamInvitationMutation } from '@/hooks/useTeam';

type JoinTeamByLinkParams = {
  acceptInvitation: ReturnType<typeof useAcceptTeamInvitationMutation>;
  email: string | undefined;
  router: ReturnType<typeof useRouter>;
  setServerError: (message: string) => void;
  showToast: ReturnType<typeof useToast>['showToast'];
  teamId: string | undefined;
  teamLink: string;
};

type HandleAlreadyJoinedTeamParams = {
  groupId: string;
  router: ReturnType<typeof useRouter>;
  setServerError: (message: string) => void;
  showToast: ReturnType<typeof useToast>['showToast'];
};

function getJoinTeamErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : '팀 참여 중 문제가 발생했어요. 다시 시도해주세요.';
}

export function handleAlreadyJoinedTeam({
  groupId,
  router,
  setServerError,
  showToast,
}: HandleAlreadyJoinedTeamParams) {
  setServerError('');
  showToast('이미 참여 중인 팀입니다.', 'error');
  router.push(ROUTES.TEAM(groupId));
}

export async function joinTeamByLink({
  acceptInvitation,
  email,
  router,
  setServerError,
  showToast,
  teamId,
  teamLink,
}: JoinTeamByLinkParams) {
  setServerError('');

  if (!teamId) {
    setServerError('팀 정보가 설정되지 않았습니다.');
    return false;
  }

  if (!email) {
    setServerError('사용자 정보를 불러오지 못했어요. 다시 로그인해주세요.');
    return false;
  }

  try {
    const joinedTeam = await acceptInvitation.mutateAsync({
      body: {
        token: extractInvitationToken(teamLink),
        userEmail: email,
      },
      teamId,
    });

    router.push(ROUTES.TEAM(String(joinedTeam.groupId)));
    showToast('팀 참여가 완료되었습니다.', 'success');
    return true;
  } catch (error) {
    setServerError(getJoinTeamErrorMessage(error));
    return false;
  }
}
