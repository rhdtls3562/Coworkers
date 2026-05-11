/**
 * 보드에 할 일이 없을 때 표시하는 단일 플레이스홀더 행입니다.
 * 클릭하면 할 일 생성 모달을 열 수 있습니다.
 */

'use client';

import { IcCalendarSmall, IcCheckboxLarge, IcRepeatSmall } from '@/assets';
import { cn } from '@/utils/cn';

function formatBoardPlaceholderDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${day}`;
}

type TaskListBoardEmptyTaskRowProps = {
  selectedDate: Date;
  className?: string;
  onClick?: () => void;
};

export default function TaskListBoardEmptyTaskRow({
  selectedDate,
  className,
  onClick,
}: TaskListBoardEmptyTaskRowProps) {
  return (
    <article
      className={cn(
        'relative flex items-start rounded-xl border border-background-tertiary bg-background-primary px-3 py-3 sm:px-4',
        onClick &&
          'cursor-pointer transition-colors hover:bg-background-secondary',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
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
            {formatBoardPlaceholderDate(selectedDate)}
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
