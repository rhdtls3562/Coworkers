/** 팀 전체 멤버 목록을 표시하는 모달 컴포넌트입니다. */

import { TeamMemberListContent } from '@/app/(service)/[teamid]/components/TeamMemberList';
import { ModalMembersProps } from '@/app/(service)/[teamid]/types';
import Modal from '@/components/common/modal';

// 멤버 리스트
export function ModalMembers({
  onClose,
  onPrimaryButtonClick,
  onMemberClick,
  members,
}: ModalMembersProps) {
  return (
    <>
      <Modal
        title="멤버"
        subTitle={`(${members.length}명)`}
        onClose={onClose}
        hasCloseButton={false}
        lineButtonText="취소"
        onLineButtonClick={onClose}
        primaryButtonText="초대하기"
        onPrimaryButtonClick={onPrimaryButtonClick}
      >
        <TeamMemberListContent
          members={members}
          onMemberClick={onMemberClick ?? (() => {})}
        />
      </Modal>
    </>
  );
}
