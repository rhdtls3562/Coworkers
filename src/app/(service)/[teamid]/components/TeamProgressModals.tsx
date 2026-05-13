/**
 * 팀 페이지에서 사용하는 멤버/팀 관련 모달들을 통합 렌더링합니다.
 */

import { ConfirmModal } from '@/app/(service)/[teamid]/components/modals/ConfirmModal';
import { ModalMemberDetail } from '@/app/(service)/[teamid]/components/modals/ModalMemberDetails';
import { ModalMembersInvite } from '@/app/(service)/[teamid]/components/modals/ModalMemberInvite';
import { ModalMembers } from '@/app/(service)/[teamid]/components/modals/ModalMembers';
import { useTeamProgressHandlers } from '@/app/(service)/[teamid]/hooks/useTeamProgressHandlers';
import { TeamProgressModalProps } from '@/app/(service)/[teamid]/types';

export function TeamProgressModals({
  is,
  close,
  open,
  reset,
  role,
  selectedMember,
  openMemberDetail,
  members,
  teamName,
}: TeamProgressModalProps) {
  const {
    canDeleteSelectedMember,
    handleDeleteTeam,
    handleLeaveTeam,
    handleRemoveMemberFromTeam,
  } = useTeamProgressHandlers({ selectedMember, reset, role });

  return (
    <>
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
            if (!canDeleteSelectedMember) return;
            open('memberDelete');
          }}
          role={role}
        />
      )}
      {is('memberInvite') && <ModalMembersInvite onClose={close} />}
      {is('teamDelete') && (
        <ConfirmModal
          onClose={close}
          title={
            teamName
              ? `'${teamName}'\n팀을 정말 삭제하시겠어요?`
              : '팀을 정말 삭제하시겠어요?'
          }
          description="삭제 후에는 되돌릴 수 없습니다."
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
          title={
            selectedMember?.userName
              ? `'${selectedMember.userName}'\n멤버를 정말 삭제하시겠어요?`
              : '멤버를 정말 삭제하시겠어요?'
          }
          description="삭제 후에는 되돌릴 수 없습니다."
          confirmText="삭제하기"
          toastMessage="삭제 되었습니다."
          onConfirm={handleRemoveMemberFromTeam}
        />
      )}
    </>
  );
}
