import Image from 'next/image';

import { ModalMembersProps } from '@/app/(service)/[teamid]/types';
import { IcUserXlarge } from '@/assets/index';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';

// 멤버 개인 정보
export function ModalMemberDetail({
  onClose,
  onPrimaryButtonClick,
  member,
}: ModalMembersProps) {
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
      subButtonText="멤버 삭제"
      onSubButtonClick={handleDelete}
      isButtonAlign={true}
    >
      <div className="flex flex-col justify-center items-center">
        <div className="rounded-xl mb-4 w-10 h-10 overflow-hidden  bg-background-tertiary">
          {member.userImage ? (
            <Image
              src={member.userImage}
              alt={`${member.userName} 프로필 이미지`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <IcUserXlarge
              width={40}
              height={40}
              className="w-full h-full"
              role="img"
              aria-label={`${member.userName} 프로필 이미지`}
            />
          )}
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
