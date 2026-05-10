// 할일 추가

import { ModalTaskProps } from '@/app/(service)/[teamid]/types';
import { Input } from '@/components/common/form';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';

export function ModalTaskAdd({ onClose }: ModalTaskProps) {
  const { showToast } = useToast();
  const handleTaskAdd = () => {
    showToast('할 일 목록이 추가되었습니다.', 'success');

    onClose();
  };

  return (
    <Modal
      title="할 일 목록 추가"
      onClose={onClose}
      primaryButtonText="만들기"
      onPrimaryButtonClick={handleTaskAdd}
    >
      <Input placeholder="할 일 목록 명을 입력해주세요." />
    </Modal>
  );
}

export function ModalTaskEdit({ onClose }: ModalTaskProps) {
  const { showToast } = useToast();
  const handleTaskEdit = () => {
    showToast('할 일 목록이 수정되었습니다.', 'success');

    onClose();
  };

  return (
    <Modal
      title="할 일 목록 수정"
      onClose={onClose}
      primaryButtonText="수정하기"
      onPrimaryButtonClick={handleTaskEdit}
    >
      <Input />
    </Modal>
  );
}
