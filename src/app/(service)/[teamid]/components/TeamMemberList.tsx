import { useParams } from 'next/navigation';

import MemberCard from '@/app/(service)/[teamid]/components/MemberCard';
import { ConfirmModal } from '@/app/(service)/[teamid]/components/modals/ConfirmModal';
import { ModalMemberDetail } from '@/app/(service)/[teamid]/components/modals/ModalMemberDetails';
import { ModalMembersInvite } from '@/app/(service)/[teamid]/components/modals/ModalMemberInvite';
import { useModalState } from '@/app/(service)/[teamid]/hooks/useModalState';
import {
  MemberChipsProps,
  TeamMemberListContentProps,
  TeamMemberProps,
} from '@/app/(service)/[teamid]/types';
import { useToast } from '@/components/common/toast';
import { useRemoveMemberTeamMutation } from '@/hooks/useTeam';

export default function TeamMemberList({ teamData, role }: TeamMemberProps) {
  const params = useParams();
  const { open, close, is, openMemberDetail, reset, selectedMember } =
    useModalState();
  const { showToast } = useToast();
  const { mutate: removeMemberTeam } = useRemoveMemberTeamMutation();

  const members = teamData.members;
  const canDeleteSelectedMember =
    role === 'ADMIN' &&
    selectedMember !== null &&
    selectedMember.role !== 'ADMIN';

  const handleRemoveMemberTeam = () => {
    if (!selectedMember) {
      return;
    }

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

  return (
    <section className="hidden xl:flex w-60 bg-background-inverse mt-11 px-5 py-6 rounded-2xl border border-border-secondary shrink-0 flex-col gap-4 h-fit min-h-28">
      <div className="flex justify-between items-center">
        <h2 className="text-text-primary text-base font-medium">
          멤버{' '}
          <span className="text-text-default font-normal">
            ({members.length}명)
          </span>
        </h2>
        <button
          className="text-brand-primary font-semibold text-sm"
          onClick={() => {
            open('memberInvite');
          }}
        >
          초대하기 +
        </button>
      </div>
      <TeamMemberListContent
        members={members}
        onMemberClick={(member) => {
          close();
          openMemberDetail(member);
        }}
      />

      {is('memberInvite') && <ModalMembersInvite onClose={close} />}

      {is('memberDetail') && (
        <ModalMemberDetail
          onClose={close}
          canDeleteMember={canDeleteSelectedMember}
          member={selectedMember}
          onPrimaryButtonClick={() => {
            if (!canDeleteSelectedMember) {
              return;
            }

            if (members.length <= 1) {
              showToast('멤버는 1명 이상 있어야 합니다.', 'error');
              return;
            }
            open('memberDelete');
          }}
          role={role}
        />
      )}

      {is('memberDelete') && (
        <ConfirmModal
          onClose={reset}
          title="해당 멤버를 삭제하시겠습니까?"
          confirmText="삭제"
          toastMessage="삭제 되었습니다."
          onConfirm={handleRemoveMemberTeam}
        />
      )}
    </section>
  );
}

export function TeamMemberListContent({
  members,
  onMemberClick,
}: TeamMemberListContentProps) {
  if (members.length === 0) {
    return (
      <p className="py-3 text-center text-sm font-normal text-text-default">
        아직 멤버가 없어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4.5 mb-3">
      {members.map((item: MemberChipsProps) => (
        <MemberCard
          key={item.userEmail}
          userImage={item.userImage}
          name={item.userName}
          email={item.userEmail}
          onClick={() => onMemberClick(item)}
        />
      ))}
    </div>
  );
}
