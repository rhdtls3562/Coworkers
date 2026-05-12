'use client';

import Modal from '@/components/common/modal';

type TaskListColumnDeleteModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  taskListTitle?: string;
};

export default function TaskListColumnDeleteModal({
  onClose,
  onConfirm,
  taskListTitle,
}: TaskListColumnDeleteModalProps) {
  const modalTitle = taskListTitle
    ? `'${taskListTitle}'\n할 일 목록을 정말 삭제하시겠어요?`
    : '할 일 목록을 삭제하시겠습니까?';

  return (
    <Modal
      hasCloseButton={false}
      hasIcon
      title={modalTitle}
      description="삭제 후에는 되돌릴 수 없습니다."
      lineButtonText="닫기"
      onClose={onClose}
      onLineButtonClick={onClose}
      onSubButtonClick={onConfirm}
      subButtonText="삭제하기"
    />
  );
}
