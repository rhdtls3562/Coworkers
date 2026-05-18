/**
 * 할 일 목록 생성 모달입니다.
 */

import { useMemo, useRef, useState } from 'react';

import type { TaskListCreateColumnModalProps } from '@/app/(service)/[teamid]/tasklist/types';
import TitleInput from '@/components/common/form/components/TitleInput';
import Modal from '@/components/common/modal';
import { TASKLIST_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

export default function TaskListCreateColumnModal({
  onClose,
  onSubmit,
}: TaskListCreateColumnModalProps) {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const isCreatingRef = useRef(false);

  const trimmedName = useMemo(() => name.trim(), [name]);

  const isAtLimit = name.length >= TASKLIST_TEXT_LIMIT;
  const isOver = trimmedName.length > TASKLIST_TEXT_LIMIT;
  const isDisabled = trimmedName.length === 0 || isOver || isCreating;

  const handleCreate = async () => {
    if (isCreatingRef.current || trimmedName.length === 0 || isOver) return;
    isCreatingRef.current = true;
    setIsCreating(true);
    try {
      await onSubmit(trimmedName);
      setName('');
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  };

  return (
    <Modal
      hasCloseButton
      title="할 일 목록"
      onClose={onClose}
      primaryButtonText="만들기"
      isPrimaryButtonDisabled={isDisabled}
      onPrimaryButtonClick={handleCreate}
    >
      <div className="w-full text-left">
        <TitleInput
          id="tasklist-column-name"
          name="columnName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="목록 명을 입력해주세요."
          aria-label="목록 이름"
          maxLength={TASKLIST_TEXT_LIMIT}
          className="placeholder:text-interaction-inactive"
          errorMessage={
            isOver ? `${TASKLIST_TEXT_LIMIT}자 이내로 작성해주세요.` : undefined
          }
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
