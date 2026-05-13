/**
 * 할 일 목록 컬럼의 한 행(제목·진행 배지·더보기 메뉴)입니다.
 * 케밥 메뉴는 lg 이상에서만 표시합니다.
 */

import type { TaskListNavItemProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcMoreVerticalLarge } from '@/assets';
import { Badge } from '@/components/common/badge';
import { ListDropdown } from '@/components/common/dropdown';
import { cn } from '@/utils/cn';

export default function TaskListNavItem({
  item,
  isActive,
  onRequestRename,
  onSelect,
  onRequestDelete,
}: TaskListNavItemProps) {
  return (
    <li className="list-none">
      <article
        className={cn(
          'relative flex h-13.75 w-full min-w-0 max-w-full items-center gap-3 rounded-xl border py-0 pl-4 pr-3 transition-colors md:pl-5 lg:max-w-67.5',
          isActive
            ? 'border-transparent bg-brand-primary shadow-none'
            : 'border-background-tertiary bg-background-primary',
        )}
        aria-current={isActive ? 'true' : undefined}
      >
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            'absolute inset-0 rounded-xl outline-none',
            isActive
              ? 'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary'
              : 'focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          )}
          aria-label={`${item.title} 목록 선택`}
        />
        <h2
          className={cn(
            'min-w-0 flex-1 truncate text-left text-sm font-medium',
            isActive ? 'text-text-inverse' : 'text-text-primary',
          )}
        >
          {item.title}
        </h2>
        <div className="relative flex shrink-0 items-center gap-1.5">
          <div
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 leading-none transition-colors',
              isActive ? 'bg-background-inverse' : 'bg-transparent',
            )}
          >
            <Badge
              completed={item.completed}
              total={item.total}
              className="items-center gap-1 leading-none"
            />
          </div>
          <ListDropdown
            trigger={
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-md',
                  isActive ? 'text-icon-inverse' : 'text-icon-primary',
                )}
              >
                <IcMoreVerticalLarge
                  width={24}
                  height={24}
                  className={cn(
                    'block size-6 shrink-0',
                    isActive && 'brightness-0 invert',
                  )}
                  aria-hidden="true"
                />
              </span>
            }
            items={[
              {
                label: '이름 변경',
                onClick: () => {
                  onRequestRename(item);
                },
              },
              {
                label: '삭제',
                onClick: () => {
                  onRequestDelete(item);
                },
              },
            ]}
            className="hidden shrink-0 lg:inline-flex"
          />
        </div>
      </article>
    </li>
  );
}
