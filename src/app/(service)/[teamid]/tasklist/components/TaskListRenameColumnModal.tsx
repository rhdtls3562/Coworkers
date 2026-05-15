/**
 * 할 일 목록 이름 변경 모달입니다.
 */

import { useMemo, useRef, useState } from 'react';

import type { TaskListRenameColumnModalProps } from '@/app/(service)/[teamid]/tasklist/types';
import TitleInput from '@/components/common/form/components/TitleInput';
import Modal from '@/components/common/modal';
import { TASKLIST_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

export default function TaskListRenameColumnModal({
  initialName,
  onClose,
  onSubmit,
}: TaskListRenameColumnModalProps) {
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const isAtLimit = name.length >= TASKLIST_TEXT_LIMIT;
  const isDisabled =
    trimmedName.length === 0 ||
    trimmedName === initialName.trim() ||
    isSubmitting;

  const handleRename = async () => {
    if (isSubmittingRef.current || trimmedName.length === 0) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      await onSubmit(trimmedName);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      hasCloseButton
      title="할 일 목록 수정"
      onClose={onClose}
      primaryButtonText="변경하기"
      isPrimaryButtonDisabled={isDisabled}
      onPrimaryButtonClick={handleRename}
    >
      <div className="w-full text-left">
        <TitleInput
          id="tasklist-column-rename"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="목록 명을 입력해주세요."
          aria-label="목록 이름 변경"
          className="placeholder:text-interaction-inactive"
          maxLength={TASKLIST_TEXT_LIMIT}
        />
        <div className="flex items-center justify-between mt-1">
          {isAtLimit ? (
            <p className="text-sm font-medium text-status-danger">
              {TASKLIST_TEXT_LIMIT}자 이내로 작성해주세요.
            </p>
          ) : (
            <span />
          )}
          <p className="text-right text-sm text-text-default">
            {name.length}/{TASKLIST_TEXT_LIMIT}
          </p>
        </div>
      </div>
    </Modal>
  );
}
