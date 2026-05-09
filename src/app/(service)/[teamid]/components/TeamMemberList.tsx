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

export default function TeamMemberList({ teamData }: TeamMemberProps) {
  const { open, close, is, openMemberDetail, selectedMember } = useModalState();

  const members = teamData.members;
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
          close(); // memberInvite 닫기
          openMemberDetail(member); // memberDetail 열기
        }}
      />

      {is('memberInvite') && <ModalMembersInvite onClose={close} />}

      {is('memberDetail') && (
        <ModalMemberDetail
          onClose={close}
          member={selectedMember}
          onPrimaryButtonClick={() => open('memberDelete')}
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
