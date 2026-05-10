// 할일 추가

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { ModalTaskProps } from '@/app/(service)/[teamid]/types';
import { Input } from '@/components/common/form';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';
import { useCreateTaskListMutation } from '@/hooks/useTaskList';

export function ModalTaskAdd({ onClose }: ModalTaskProps) {
  const { showToast } = useToast();
  const params = useParams();
  const { mutate: createTaskList } = useCreateTaskListMutation();

  const [taskListName, setTaskListName] = useState('');

  const handleTaskAdd = () => {
    createTaskList(
      {
        groupId: params.teamid as string,
        teamId: params.teamid as string,
        body: { name: taskListName },
      },
      {
        onSuccess: () => {
          showToast('할 일 목록이 추가되었습니다.', 'success');
          onClose();
        },
        onError: () => {
          showToast('생성에 실패했습니다.', 'error');
        },
      },
    );
  };

  return (
    <Modal
      title="할 일 목록 추가"
      onClose={onClose}
      primaryButtonText="만들기"
      onPrimaryButtonClick={handleTaskAdd}
    >
      <Input
        placeholder="할 일 목록 명을 입력해주세요."
        onChange={(e) => setTaskListName(e.target.value)}
      />
    </Modal>
  );
}

export function ModalTaskEdit({
  onClose,
  initialTitle,
  // taskListId, 나중에 수정 API 연결할 때 사용할 예정
}: ModalTaskProps & { initialTitle?: string; taskListId?: number }) {
  const { showToast } = useToast();

  const [taskListName, setTaskListName] = useState(initialTitle ?? '');

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
      <Input
        value={taskListName}
        onChange={(e) => setTaskListName(e.target.value)}
      />
    </Modal>
  );
}
