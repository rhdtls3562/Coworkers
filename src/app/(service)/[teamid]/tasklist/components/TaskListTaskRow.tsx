/**
 * 할 일 보드의 단일 할 일 행(체크·제목·메타·더보기)입니다.
 */

import TaskListTaskRowOptionsMenu from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskRowOptionsMenu';
import type { TaskListTaskRowProps } from '@/app/(service)/[teamid]/tasklist/types';
import {
  IcCalendarSmall,
  IcComment,
  IcMoreVerticalSmall,
  IcRepeatSmall,
} from '@/assets';
import TodoCheckUncheck from '@/components/common/todo/TodoCheckUncheck';
import { cn } from '@/utils/cn';

export default function TaskListTaskRow({
  task,
  onOpenDetail,
  onToggleChecked,
  onRequestDelete,
}: TaskListTaskRowProps) {
  const handleOpenDetail = () => {
    onOpenDetail(task, 'view');
  };

  return (
    <article
      className={cn(
        'relative flex items-start rounded-xl border border-background-tertiary bg-background-primary px-3 py-3 transition-colors hover:bg-background-secondary focus-visible:bg-background-secondary sm:px-4',
        task.checked && 'bg-background-secondary',
      )}
    >
      <button
        type="button"
        onClick={handleOpenDetail}
        className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        aria-label={`${task.title} 상세 열기`}
      />

      <div className="relative z-10 min-w-0 flex-1 pr-10 pointer-events-none sm:pr-11">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex min-w-0 flex-1 pointer-events-auto items-center gap-2">
            <TodoCheckUncheck
              label={task.title}
              checked={task.checked}
              onChange={(checked) => onToggleChecked(task.id, checked)}
            />

            <button
              type="button"
              className="pointer-events-auto mb-0.5 flex shrink-0 items-center gap-1 text-sm font-medium text-text-default md:text-base"
              aria-label={`${task.title} 댓글 ${task.commentCount}개 보기`}
              onClick={handleOpenDetail}
            >
              <IcComment
                width={22}
                height={22}
                className="size-5.5"
                aria-hidden="true"
              />
              {task.commentCount}
            </button>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-normal text-text-default md:mt-2 md:text-base">
          <span className="flex items-center gap-2">
            <IcCalendarSmall width={16} height={16} aria-hidden="true" />
            {task.dueDateLabel}
          </span>

          <span aria-hidden="true" className="text-border-secondary">
            |
          </span>

          <span className="flex items-center gap-2">
            <IcRepeatSmall width={20} height={20} aria-hidden="true" />
            {task.repeatLabel}
          </span>
        </div>
      </div>

      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-3">
        <TaskListTaskRowOptionsMenu
          className="shrink-0"
          items={[
            {
              label: '상세보기',
              onClick: () => {
                handleOpenDetail();
              },
            },
            {
              label: '삭제하기',
              onClick: () => {
                onRequestDelete(task);
              },
            },
          ]}
          trigger={
            <>
              <span className="sr-only">{`${task.title} 더보기`}</span>
              <span
                className="flex size-8 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <IcMoreVerticalSmall
                  width={22}
                  height={22}
                  aria-hidden="true"
                />
              </span>
            </>
          }
        />
      </div>
    </article>
  );
}
