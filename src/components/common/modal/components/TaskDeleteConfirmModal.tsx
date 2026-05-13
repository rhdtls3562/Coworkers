/**
 * 할 일 삭제 확인 모달입니다.
 */

import ModalFrame from '@/components/common/modal/components/ModalFrame';
import ModalPortal from '@/components/common/modal/components/ModalPortal';

type TaskDeleteConfirmModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  taskTitle?: string;
};

export default function TaskDeleteConfirmModal({
  onClose,
  onConfirm,
  taskTitle,
}: TaskDeleteConfirmModalProps) {
  const modalTitle = taskTitle
    ? `'${taskTitle}'\n할 일을 정말 삭제하시겠어요?`
    : '할 일을 정말 삭제하시겠어요?';

  return (
    <ModalPortal>
      <ModalFrame
        hasIcon
        hasCloseButton={false}
        title={modalTitle}
        description="삭제 후에는 되돌릴 수 없습니다."
        lineButtonText="취소"
        onLineButtonClick={onClose}
        subButtonText="삭제하기"
        onSubButtonClick={onConfirm}
        onClose={onClose}
      />
    </ModalPortal>
  );
}
