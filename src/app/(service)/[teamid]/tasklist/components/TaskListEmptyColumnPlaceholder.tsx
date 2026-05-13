/**
 * 할 일 목록(컬럼)이 없을 때 표시하는 빈 상태 한 줄입니다. (피그마: 제목 없음 + 0/0 + 메뉴)
 */

import type { TaskListEmptyColumnPlaceholderProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcMoreVerticalLarge } from '@/assets';
import { Badge } from '@/components/common/badge';
import { ListDropdown } from '@/components/common/dropdown';
import { cn } from '@/utils/cn';

export default function TaskListEmptyColumnPlaceholder({
  className,
}: TaskListEmptyColumnPlaceholderProps) {
  return (
    <article
      className={cn(
        'flex items-center rounded-xl border border-background-tertiary bg-background-primary py-0',
        // lg 미만: 드롭다운 트리거와 동일 (모바일 180px / 태블릿 md~lg 240px 고정, flex로 늘어나지 않음)
        'box-border h-11 w-45 shrink-0 gap-2 pl-4 pr-3 md:w-60 md:max-w-60 md:flex-none',
        // lg+: 목록 한 행(TaskListNavItem)과 동일 (pl-5는 md 이상과 동일)
        'lg:h-13.75 lg:w-full lg:max-w-67.5 lg:min-w-0 lg:gap-3 lg:pl-5 lg:pr-3',
        className,
      )}
      aria-label="할 일 목록이 비어 있습니다"
    >
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        목록이 없습니다.
      </p>
      <div className="flex shrink-0 items-center gap-1.5">
        <Badge
          completed={0}
          total={0}
          className="shrink-0 items-center gap-1 leading-none"
        />
        <ListDropdown
          trigger={
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md text-icon-primary hover:bg-background-tertiary">
              <IcMoreVerticalLarge
                width={24}
                height={24}
                className="block size-6 shrink-0"
                aria-hidden="true"
              />
            </span>
          }
          items={[
            { label: '이름 변경', onClick: () => {} },
            { label: '삭제', onClick: () => {} },
          ]}
          className="hidden shrink-0 lg:inline-flex"
        />
      </div>
    </article>
  );
}
