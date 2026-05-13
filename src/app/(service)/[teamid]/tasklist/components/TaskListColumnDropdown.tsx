/**
 * 모바일/태블릿용 할 일 목록 선택 드롭다운입니다.
 */

import type { TaskListColumnDropdownProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcCheck, IcDownArrowLarge, IcDownArrowSmall } from '@/assets';
import { Badge } from '@/components/common/badge';
import { useDropdown } from '@/components/common/dropdown/hooks/useDropdown';
import { cn } from '@/utils/cn';

export default function TaskListColumnDropdown({
  items,
  activeId,
  onSelect,
  className,
}: TaskListColumnDropdownProps) {
  const { isOpen, toggle, close, containerRef } = useDropdown();
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (items.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn('relative min-w-0', className)}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="할 일 목록 선택"
        className={cn(
          'box-border flex h-11 w-45 max-w-full min-w-0 flex-none flex-row items-center gap-2 rounded-xl border border-background-tertiary',
          'bg-background-primary py-0 pl-4 pr-3 text-left text-sm font-medium text-text-primary',
          'md:w-60 md:max-w-none md:shrink-0',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="min-w-0 truncate">{active?.title}</span>
          {active ? (
            <Badge
              completed={active.completed}
              total={active.total}
              className="shrink-0 items-center gap-1 leading-none"
            />
          ) : null}
        </div>
        <span
          className={cn(
            'shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden
        >
          <IcDownArrowSmall
            width={20}
            height={20}
            className="block md:hidden"
            aria-hidden="true"
          />
          <IcDownArrowLarge
            width={24}
            height={24}
            className="hidden md:block"
            aria-hidden="true"
          />
        </span>
      </button>
      {isOpen ? (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-background-tertiary bg-background-primary shadow-lg"
        >
          {items.map((item) => {
            const isSelected = item.id === activeId;
            return (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    'flex w-full min-w-0 items-center gap-2 px-3 py-3 text-left text-sm font-medium text-text-primary',
                    'md:items-center md:justify-between md:gap-15 md:px-4 md:py-3',
                    'hover:bg-background-secondary',
                    isSelected && 'bg-brand-secondary text-brand-primary',
                  )}
                  onClick={() => {
                    onSelect(item.id);
                    close();
                  }}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2 md:min-w-0">
                    <span className="inline-flex size-4 shrink-0 items-center justify-center">
                      {isSelected ? (
                        <IcCheck
                          width={16}
                          height={16}
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 truncate">{item.title}</span>
                  </span>
                  <Badge
                    completed={item.completed}
                    total={item.total}
                    className="shrink-0 items-center gap-1 leading-none"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
