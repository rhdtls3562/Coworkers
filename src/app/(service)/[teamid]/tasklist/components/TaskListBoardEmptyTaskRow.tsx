/**
 * 보드에 할 일이 없을 때 표시하는 단일 플레이스홀더 행입니다.
 */

import type { KeyboardEvent } from 'react';

import type { TaskListBoardEmptyTaskRowProps } from '@/app/(service)/[teamid]/tasklist/types';
import { formatTaskListBoardPlaceholderDate } from '@/app/(service)/[teamid]/tasklist/utils/taskListBoardPlaceholder';
import { IcCalendarSmall, IcCheckboxLarge, IcRepeatSmall } from '@/assets';
import { cn } from '@/utils/cn';

export default function TaskListBoardEmptyTaskRow({
  selectedDate,
  className,
  onClick,
}: TaskListBoardEmptyTaskRowProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onClick();
  };

  return (
    <article
      className={cn(
        'relative flex items-start rounded-xl border border-background-tertiary bg-background-primary px-3 py-3 transition-colors hover:bg-background-secondary focus-visible:bg-background-secondary sm:px-4',
        className,
      )}
      role="button"
      tabIndex={0}
      aria-label="할 일 만들기 열기"
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start gap-2 md:gap-2.5">
          <IcCheckboxLarge
            width={16}
            height={16}
            className="mt-0.5 h-3 w-3 shrink-0 md:h-4 md:w-4"
            aria-hidden="true"
          />
          <p className="min-w-0 text-sm font-normal leading-snug text-interaction-inactive md:text-base">
            할 일을 달성하기 위한 체크리스트를 입력해주세요.
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-normal text-text-default md:mt-2.5 md:text-base">
          <span className="flex items-center gap-2">
            <IcCalendarSmall width={16} height={16} aria-hidden="true" />
            {formatTaskListBoardPlaceholderDate(selectedDate)}
          </span>
          <span aria-hidden="true" className="text-border-secondary">
            |
          </span>
          <span className="flex items-center gap-2">
            <IcRepeatSmall width={20} height={20} aria-hidden="true" />
            매일 반복
          </span>
        </div>
      </div>
    </article>
  );
}
