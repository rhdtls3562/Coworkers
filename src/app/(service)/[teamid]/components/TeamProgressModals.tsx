import { ConfirmModal } from '@/app/(service)/[teamid]/components/modals/ConfirmModal';
import { ModalMemberDetail } from '@/app/(service)/[teamid]/components/modals/ModalMemberDetails';
import { ModalMembersInvite } from '@/app/(service)/[teamid]/components/modals/ModalMemberInvite';
import { ModalMembers } from '@/app/(service)/[teamid]/components/modals/ModalMembers';
import { TeamProgressModalProps } from '@/app/(service)/[teamid]/types';

export function TeamProgressModals({
  is,
  close,
  open,
  selectedMember,
  openMemberDetail,
}: TeamProgressModalProps) {
  return (
    <>
      {/* 각 레이어 불러오기 */}
      {is('memberList') && (
        <ModalMembers
          onClose={close}
          onMemberClick={(member) => {
            close();
            openMemberDetail(member);
          }}
        />
      )}
      {is('memberDetail') && (
        <ModalMemberDetail
          onClose={close}
          member={selectedMember}
          onPrimaryButtonClick={() => open('memberDelete')}
        />
      )}
      {is('memberInvite') && <ModalMembersInvite onClose={close} />}
      {is('teamDelete') && (
        <ConfirmModal
          onClose={close}
          title="해당 팀을 삭제하시겠습니까?"
          description="팀 관련 모든 정보가 삭제됩니다."
          confirmText="삭제"
          toastMessage="삭제 되었습니다."
        />
      )}
      {is('teamLeave') && (
        <ConfirmModal
          onClose={close}
          title="해당 팀에서 나가시겠어요?"
          confirmText="팀 나가기"
          toastMessage="팀에서 나왔습니다."
        />
      )}

      {is('memberDelete') && (
        <ConfirmModal
          onClose={close}
          title="해당 멤버를 삭제하시겠습니까?"
          confirmText="삭제"
          toastMessage="삭제 되었습니다."
        />
      )}
    </>
  );
}
