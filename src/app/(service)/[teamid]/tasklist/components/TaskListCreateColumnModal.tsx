/**
 * 할 일 목록 생성 모달입니다.
 */

import { useMemo, useRef, useState } from 'react';

import type { TaskListCreateColumnModalProps } from '@/app/(service)/[teamid]/tasklist/types';
import TitleInput from '@/components/common/form/components/TitleInput';
import Modal from '@/components/common/modal';

export default function TaskListCreateColumnModal({
  onClose,
  onSubmit,
}: TaskListCreateColumnModalProps) {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const isCreatingRef = useRef(false);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const isOver = trimmedName.length > 15;
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="목록 명을 입력해주세요."
          aria-label="목록 이름"
          className="placeholder:text-interaction-inactive"
          errorMessage={isOver ? '15자 이내로 작성해주세요.' : undefined}
        />
      </div>
    </Modal>
  );
}
