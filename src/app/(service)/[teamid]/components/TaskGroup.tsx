import { ModalTaskAdd } from '@/app/(service)/[teamid]/components/modals/ModalTaskAddEdit';
import TaskItem from '@/app/(service)/[teamid]/components/TaskItem';
import { EMPTY_MESSAGE, STATUS } from '@/app/(service)/[teamid]/constants';
import { useModalState } from '@/app/(service)/[teamid]/hooks/useModalState';
import { TaskProps } from '@/app/(service)/[teamid]/types';
import { IcPlusSub } from '@/assets/index';

export default function TaskGroup({ status, taskLists }: TaskProps) {
  const { open, close, is } = useModalState();
  return (
    <div className="flex flex-col gap-3 min-w-0 xl:flex-1 xl:gap:5">
      <div className="flex justify-between items-center bg-background-tertiary rounded-xl pl-5 pr-2 h-9.5 w-full">
        <h3 className="text-text-primary text-sm font-medium">{status}</h3>
        {status === '시작 전' && (
          <button
            className="border border-border-secondary rounded-lg bg-background-inverse w-6 h-6 flex justify-center items-center"
            onClick={() => open('taskAdd')}
          >
            <IcPlusSub
              width="16"
              height="16"
              role="img"
              aria-label="할일 추가 버튼"
            />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3 xl:gap-2">
        {taskLists.map((taskItems) => (
          <TaskItem
            key={taskItems.id}
            title={taskItems.name}
            status={status}
            tasks={taskItems.tasks}
            taskListId={taskItems.id}
          />
        ))}

        {taskLists.length === 0 && (
          <div className="rounded-2xl px-6 py-8 text-center text-sm font-normal text-text-default block xl:hidden">
            {EMPTY_MESSAGE[status]}
          </div>
        )}
      </div>
      {is('taskAdd') && <ModalTaskAdd onClose={close} />}
    </div>
  );
}
