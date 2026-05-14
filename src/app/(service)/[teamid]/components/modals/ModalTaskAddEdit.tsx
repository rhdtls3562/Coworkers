// 할일 추가

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { ModalTaskProps } from '@/app/(service)/[teamid]/types';
import { Input } from '@/components/common/form';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';
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
  const isOver = trimmed.length > 15;
  const isDisabled = trimmed.length === 0 || isOver;

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
        onChange={(e) => setTaskListName(e.target.value)}
      />
      {isOver && (
        <p className="mt-2 text-sm font-medium text-status-danger">
          15자 이내로 작성해주세요.
        </p>
      )}
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
  const isOver = trimmed.length > 15;
  const isDisabled =
    trimmed.length === 0 || trimmed === (initialTitle ?? '').trim() || isOver;

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
        onChange={(e) => setTaskListName(e.target.value)}
      />
      {isOver && (
        <p className="mt-2 text-left text-sm font-medium text-status-danger">
          15자 이내로 작성해주세요.
        </p>
      )}
    </Modal>
  );
}
