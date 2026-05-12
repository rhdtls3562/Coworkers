/**
 * 완료된 히스토리 할 일 카드 한 개를 렌더링하는 컴포넌트입니다.
 */

import useHistoryTaskCardMutation from '@/app/(service)/myhistory/hooks/useHistoryTaskCardMutation';
import type { HistoryTaskCardProps } from '@/app/(service)/myhistory/types';
import {
  IcCalendarSmall,
  IcComment,
  IcMoreVerticalSmall,
  IcRepeatSmall,
} from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import { TaskDeleteConfirmModal } from '@/components/common/modal';
import TodoCheckUncheck from '@/components/common/todo/TodoCheckUncheck';
import { cn } from '@/utils/cn';

export default function HistoryTaskCard({ task }: HistoryTaskCardProps) {
  const {
    dropdownItems,
    handleCloseDeleteModal,
    handleConfirmDelete,
    isDeleteModalOpen,
  } = useHistoryTaskCardMutation({ task });

  return (
    <article
      className={cn(
        'relative flex items-start rounded-xl border border-background-tertiary px-3.5 py-3',
        task.isCompleted ? 'bg-background-secondary' : 'bg-background-primary',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <TodoCheckUncheck label={task.title} checked={task.isCompleted} />
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-text-default">
            <IcComment
              width={22}
              height={22}
              className="size-5.5"
              aria-hidden="true"
            />
            {task.commentCount}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-normal text-text-default md:mt-2.5 2xl:mt-2">
          <span className="flex items-center gap-2">
            <IcCalendarSmall width={16} height={16} aria-hidden="true" />
            {task.dueDate}
          </span>
          <span aria-hidden="true">|</span>
          <span className="flex items-center gap-2">
            <IcRepeatSmall width={22} height={22} aria-hidden="true" />
            {task.frequency}
          </span>
        </div>
      </div>

      <ListDropdown
        className="ml-3 shrink-0"
        items={dropdownItems}
        trigger={
          <>
            <span className="sr-only">{`${task.title} 더보기`}</span>
            <span
              className="flex size-8 items-center justify-center rounded-lg"
              aria-hidden="true"
            >
              <IcMoreVerticalSmall width={22} height={22} aria-hidden="true" />
            </span>
          </>
        }
      />

      {isDeleteModalOpen && (
        <TaskDeleteConfirmModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          taskTitle={task.title}
        />
      )}
    </article>
  );
}
