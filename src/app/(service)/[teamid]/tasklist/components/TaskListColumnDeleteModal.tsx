/**
 * 할 일 목록 삭제 확인 모달입니다.
 */

import type { TaskListColumnDeleteModalProps } from '@/app/(service)/[teamid]/tasklist/types';
import Modal from '@/components/common/modal';

export default function TaskListColumnDeleteModal({
  onClose,
  onConfirm,
  taskListTitle,
}: TaskListColumnDeleteModalProps) {
  const modalTitle = taskListTitle
    ? `'${taskListTitle}'\n할 일 목록을 정말 삭제하시겠어요?`
    : '할 일 목록을 정말 삭제하시겠어요?';

  return (
    <Modal
      hasCloseButton={false}
      hasIcon
      title={modalTitle}
      description="삭제 후에는 되돌릴 수 없습니다."
      lineButtonText="취소"
      onClose={onClose}
      onLineButtonClick={onClose}
      onSubButtonClick={onConfirm}
      subButtonText="삭제하기"
    />
  );
}
