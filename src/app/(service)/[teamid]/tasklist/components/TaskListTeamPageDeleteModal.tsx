'use client';

import Modal from '@/components/common/modal';

type TaskListTeamPageDeleteModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  pageTitle?: string;
};

export default function TaskListTeamPageDeleteModal({
  onClose,
  onConfirm,
  pageTitle,
}: TaskListTeamPageDeleteModalProps) {
  const modalTitle = pageTitle
    ? `'${pageTitle}'\n페이지를 정말 삭제하시겠어요?`
    : '페이지를 삭제하시겠습니까?';

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
