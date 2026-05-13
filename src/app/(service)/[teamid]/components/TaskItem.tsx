/**
 * 팀 페이지의 할 일 목록 카드와 관련 모달을 렌더링합니다.
 */

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ConfirmModal } from '@/app/(service)/[teamid]/components/modals/ConfirmModal';
import { ModalTaskEdit } from '@/app/(service)/[teamid]/components/modals/ModalTaskAddEdit';
import { DROPDOWN_BUTTON } from '@/app/(service)/[teamid]/constants';
import { useModalState } from '@/app/(service)/[teamid]/hooks/useModalState';
import { TaskItemPropsExtended } from '@/app/(service)/[teamid]/types';
import { IcMoreArrow } from '@/assets/index';
import { Badge } from '@/components/common/badge';
import { ListDropdown } from '@/components/common/dropdown';
import TodoCheckUncheck from '@/components/common/todo/TodoCheckUncheck';
import { useUpdateTaskMutation } from '@/hooks/useTask';
import { useDeleteTaskListMutation } from '@/hooks/useTaskList';
import { cn } from '@/utils/cn';

export default function TaskItem({
  title,
  status,
  tasks,
  taskListId,
}: TaskItemPropsExtended) {
  const params = useParams();
  const teamId = params.teamid as string;

  const { open, close, is } = useModalState();
  const { mutate: updateTask } = useUpdateTaskMutation();
  const { mutate: deleteTaskList } = useDeleteTaskListMutation();

  const completedCount = tasks.filter((task) => task.doneAt !== null).length;

  const handleToggle = (taskId: number, currentDoneAt: string | null) => {
    updateTask({
      teamId,
      taskListId,
      taskId,
      body: { done: currentDoneAt === null },
    });
  };

  const handleDelete = () => {
    deleteTaskList({ groupId: teamId, taskListId, teamId });
  };

  const DropdownItems = [
    { label: '수정하기', onClick: () => open('taskEdit') },
    { label: '삭제하기', onClick: () => open('taskDelete') },
  ];

  return (
    <div className="w-full">
      <div
        className={cn(
          'bg-background-inverse p-6 pr-3 rounded-2xl border border-border-secondary flex flex-col gap-4',
          {
            'pl-6 pr-3 py-3.5': status === '완료',
          },
        )}
      >
        <div className="flex gap-3 items-center w-full">
          <div className="flex-1 min-w-0 flex items-center">
            <Link
              href={'/' + teamId + '/tasklist/' + taskListId}
              className="group flex items-center gap-1.5 min-w-0 text-text-primary text-base font-semibold transition-colors duration-200 ease-in-out hover:text-brand-primary"
            >
              <span className="truncate">{title}</span>
              <IcMoreArrow
                width="10"
                height="10"
                role="img"
                aria-label="할일 목록 이동 버튼"
                className="shrink-0 text-text-default transition-colors duration-200 ease-in-out group-hover:text-brand-primary"
              />
            </Link>
          </div>
          <div className=" shrink-0">
            <Badge completed={completedCount} total={tasks.length} />
          </div>
          <div className="w-6 h-6 shrink-0">
            <ListDropdown trigger={DROPDOWN_BUTTON} items={DropdownItems} />
          </div>
        </div>
        {status !== '완료' && (
          <div className="flex flex-col gap-3 pr-2 w-full">
            {tasks.length > 0 ? (
              tasks
                .slice(0, 3)
                .map((task) => (
                  <TodoCheckUncheck
                    key={task.id}
                    label={task.name}
                    checked={task.doneAt !== null}
                    onChange={() => handleToggle(task.id, task.doneAt)}
                  />
                ))
            ) : (
              <p className="text-sm font-normal text-text-default">
                아직 체크리스트가 없어요.
              </p>
            )}
          </div>
        )}
      </div>

      {is('taskEdit') && (
        <ModalTaskEdit
          onClose={close}
          initialTitle={title}
          taskListId={taskListId}
        />
      )}
      {is('taskDelete') && (
        <ConfirmModal
          onClose={close}
          title={`'${title}'\n할 일 목록을 정말 삭제하시겠어요?`}
          description="삭제 후에는 되돌릴 수 없습니다."
          confirmText="삭제하기"
          toastMessage="삭제 되었습니다."
          onConfirm={() => handleDelete()}
        />
      )}
    </div>
  );
}
