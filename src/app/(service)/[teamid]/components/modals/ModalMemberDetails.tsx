import UserAvatar from '@/app/(service)/[teamid]/components/UserImage';
import { ModalMemberProps } from '@/app/(service)/[teamid]/types';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';

// 멤버 개인 정보
export function ModalMemberDetail({
  onClose,
  onPrimaryButtonClick,
  canDeleteMember = false,
  member,
  role,
}: ModalMemberProps) {
  const { showToast } = useToast();

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(member?.userEmail ?? '');
      showToast('이메일이 복사되었습니다.', 'success');
      onClose();
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleDelete = async () => {
    try {
      onPrimaryButtonClick?.();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };
  if (!member) return null;

  return (
    <Modal
      onClose={onClose}
      primaryButtonText="이메일 복사하기"
      onPrimaryButtonClick={handleCopyEmail}
      subButtonText={
        role === 'ADMIN' && canDeleteMember ? '멤버 삭제' : undefined
      }
      onSubButtonClick={
        role === 'ADMIN' && canDeleteMember ? handleDelete : undefined
      }
      isButtonAlign={true}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-xl mb-4 w-10 h-10 overflow-hidden  bg-background-tertiary">
          <UserAvatar
            userImage={member.userImage}
            userName={member.userName}
            size={40}
          />
        </div>
        <p className="text-base text-text-primary font-semibold mb-1">
          {member?.userName}
        </p>
        <p className="text-sm text-text-secondary font-normal">
          {member?.userEmail}
        </p>
      </div>
    </Modal>
  );
}
