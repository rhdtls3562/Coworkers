import Modal from '@/components/common/modal';
import { ModalFrameProps } from '@/components/common/modal/types';
import { useToast } from '@/components/common/toast';

// 멤버 초대 모달
export function ModalMembersInvite({ onClose }: ModalFrameProps) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      showToast('링크가 복사되었습니다.', 'success');
      onClose();
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <Modal
      title="멤버 초대"
      description="그룹에 참여할 수 있는 링크를 복사합니다."
      primaryButtonText="링크 복사하기"
      onPrimaryButtonClick={handleCopy}
      onClose={onClose}
    />
  );
}
