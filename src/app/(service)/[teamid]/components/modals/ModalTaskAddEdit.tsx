/** 할 일 추가·수정 모달 컴포넌트입니다. */

// 할일 추가

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { ModalTaskProps } from '@/app/(service)/[teamid]/types';
import { Input } from '@/components/common/form';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';
import { TASKLIST_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';
import {
  useCreateTaskListMutation,
  useUpdateTaskListMutation,
} from '@/hooks/useTaskList';

export function ModalTaskAdd({ onClose }: ModalTaskProps) {
  const { showToast } = useToast();
  const params = useParams();
  const { isPending: isCreateTaskListPending, mutateAsync: createTaskList } =
    useCreateTaskListMutation();

  const [taskListName, setTaskListName] = useState('');

  const trimmed = taskListName.trim();
  const isAtLimit = taskListName.length >= TASKLIST_TEXT_LIMIT;
  const isDisabled = trimmed.length === 0;

  const handleTaskAdd = async () => {
    if (isDisabled || isCreateTaskListPending) return;

    try {
      await createTaskList({
        groupId: params.teamid as string,
        teamId: params.teamid as string,
        body: { name: trimmed },
      });
      showToast('할 일 목록이 추가되었습니다.', 'success');
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '생성에 실패했습니다.';

      showToast(message, 'error');
    }
  };

  return (
    <Modal
      title="할 일 목록 추가"
      onClose={onClose}
      primaryButtonText="만들기"
      isPrimaryButtonDisabled={isDisabled || isCreateTaskListPending}
      onPrimaryButtonClick={handleTaskAdd}
    >
      <Input
        placeholder="할 일 목록 명을 입력해주세요."
        disabled={isCreateTaskListPending}
        maxLength={TASKLIST_TEXT_LIMIT}
        onChange={(e) => setTaskListName(e.target.value)}
      />
      <div className="flex items-center justify-between mt-1">
        {isAtLimit ? (
          <p className="text-left text-sm font-medium text-status-danger">
            {TASKLIST_TEXT_LIMIT}자 이내로 작성해주세요.
          </p>
        ) : (
          <span />
        )}
        <p className="text-right text-sm text-text-default">
          {taskListName.length}/{TASKLIST_TEXT_LIMIT}
        </p>
      </div>
    </Modal>
  );
}

export function ModalTaskEdit({
  onClose,
  initialTitle,
  taskListId,
}: ModalTaskProps & { initialTitle?: string; taskListId?: number }) {
  const { showToast } = useToast();
  const params = useParams();
  const teamId = params.teamid as string;
  const { isPending: isUpdateTaskListPending, mutateAsync: updateTaskList } =
    useUpdateTaskListMutation();

  const [taskListName, setTaskListName] = useState(initialTitle ?? '');

  const trimmed = taskListName.trim();
  const isAtLimit = taskListName.length >= TASKLIST_TEXT_LIMIT;
  const isDisabled =
    trimmed.length === 0 || trimmed === (initialTitle ?? '').trim();

  const handleTaskEdit = async () => {
    if (!taskListId || isDisabled || isUpdateTaskListPending) return;

    try {
      await updateTaskList({
        groupId: teamId,
        taskListId,
        body: { name: trimmed },
        teamId,
      });
      showToast('할 일 목록이 수정되었습니다.', 'success');
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '수정에 실패했습니다.';

      showToast(message, 'error');
    }
  };

  return (
    <Modal
      title="할 일 목록 수정"
      onClose={onClose}
      primaryButtonText="수정하기"
      isPrimaryButtonDisabled={isDisabled || isUpdateTaskListPending}
      onPrimaryButtonClick={handleTaskEdit}
    >
      <Input
        value={taskListName}
        disabled={isUpdateTaskListPending}
        maxLength={TASKLIST_TEXT_LIMIT}
        onChange={(e) => setTaskListName(e.target.value)}
      />
      <div className="flex items-center justify-between mt-1">
        {isAtLimit ? (
          <p className="text-left text-sm font-medium text-status-danger">
            {TASKLIST_TEXT_LIMIT}자 이내로 작성해주세요.
          </p>
        ) : (
          <span />
        )}
        <p className="text-right text-sm text-text-default">
          {taskListName.length}/{TASKLIST_TEXT_LIMIT}
        </p>
      </div>
    </Modal>
  );
}
