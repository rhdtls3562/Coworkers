import { useParams, useRouter } from 'next/navigation';

import { ConfirmModal } from '@/app/(service)/[teamid]/components/modals/ConfirmModal';
import { ModalMemberDetail } from '@/app/(service)/[teamid]/components/modals/ModalMemberDetails';
import { ModalMembersInvite } from '@/app/(service)/[teamid]/components/modals/ModalMemberInvite';
import { ModalMembers } from '@/app/(service)/[teamid]/components/modals/ModalMembers';
import { TeamProgressModalProps } from '@/app/(service)/[teamid]/types';
import { resolveTeamExitRoute } from '@/app/(service)/[teamid]/utils/teamRouteAccess';
import {
  useDeleteTeamMutation,
  useRemoveMemberTeamMutation,
} from '@/hooks/useTeam';
import { useMeQuery } from '@/hooks/useUser';

export function TeamProgressModals({
  is,
  close,
  open,
  reset,
  role,
  selectedMember,
  openMemberDetail,
  members,
}: TeamProgressModalProps) {
  const params = useParams();
  const router = useRouter();
  const { data: meData } = useMeQuery();

  const { mutate: deleteTeam } = useDeleteTeamMutation();
  const { mutate: removeMemberTeam } = useRemoveMemberTeamMutation();
  const canDeleteSelectedMember =
    role === 'ADMIN' &&
    selectedMember !== null &&
    selectedMember.userId !== meData?.id;

  const handleDeleteTeam = () => {
    const fallbackRoute = resolveTeamExitRoute(
      String(params.teamid),
      meData?.memberships,
    );

    deleteTeam(
      { teamId: params.teamid as string },
      {
        onSuccess: () => {
          router.replace(fallbackRoute);
        },
      },
    );
  };
  const handleRemoveMemberTeam = () => {
    if (!selectedMember) return;

    removeMemberTeam(
      {
        teamId: params.teamid as string,
        memberUserId: selectedMember.userId,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };
  const handleLeaveTeam = () => {
    if (!meData?.id) return;

    const fallbackRoute = resolveTeamExitRoute(
      String(params.teamid),
      meData.memberships,
    );

    removeMemberTeam(
      {
        teamId: params.teamid as string,
        memberUserId: meData.id,
      },
      {
        onSuccess: () => {
          router.replace(fallbackRoute);
        },
      },
    );
  };
  return (
    <>
      {/* 각 레이어 불러오기 */}
      {is('memberList') && (
        <ModalMembers
          onClose={close}
          members={members}
          onMemberClick={(member) => {
            close();
            openMemberDetail(member);
          }}
          onPrimaryButtonClick={() => {
            close();
            open('memberInvite');
          }}
        />
      )}
      {is('memberDetail') && (
        <ModalMemberDetail
          onClose={close}
          canDeleteMember={canDeleteSelectedMember}
          member={selectedMember}
          onPrimaryButtonClick={() => {
            if (!canDeleteSelectedMember) {
              return;
            }

            open('memberDelete');
          }}
          role={role}
        />
      )}
      {is('memberInvite') && <ModalMembersInvite onClose={close} />}
      {is('teamDelete') && (
        <ConfirmModal
          onClose={close}
          title="해당 팀을 삭제하시겠습니까?"
          description="팀 관련 모든 정보가 삭제됩니다."
          confirmText="삭제하기"
          toastMessage="삭제 되었습니다."
          onConfirm={handleDeleteTeam}
        />
      )}
      {is('teamLeave') && (
        <ConfirmModal
          onClose={close}
          title="해당 팀에서 나가시겠어요?"
          confirmText="팀 나가기"
          toastMessage="팀에서 나왔습니다."
          onConfirm={handleLeaveTeam}
        />
      )}

      {is('memberDelete') && (
        <ConfirmModal
          onClose={reset}
          title="해당 멤버를 삭제하시겠습니까?"
          confirmText="삭제하기"
          toastMessage="삭제 되었습니다."
          onConfirm={handleRemoveMemberTeam}
        />
      )}
    </>
  );
}
