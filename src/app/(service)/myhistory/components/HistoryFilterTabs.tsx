/**
 * 히스토리 필터 탭 목록을 렌더링하는 컴포넌트입니다.
 */

import useDragScroll from '@/app/(service)/myhistory/hooks/useDragScroll';
import type { HistoryFilterTabsProps } from '@/app/(service)/myhistory/types';
import { cn } from '@/utils/cn';

export default function HistoryFilterTabs({
  activeFilterId,
  filters,
  onSelectFilter,
}: HistoryFilterTabsProps) {
  const {
    containerRef,
    handleClickCapture,
    handlePointerDown,
    handlePointerMove,
  } = useDragScroll();

  return (
    <ul
      ref={containerRef}
      onClickCapture={handleClickCapture}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className="flex cursor-grab gap-1 overflow-x-auto overscroll-x-contain select-none md:gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
    >
      {filters.map((filter) => {
        const isActive = activeFilterId === filter.id;

        return (
          <li key={filter.id}>
            <button
              type="button"
              data-allow-unsaved="true"
              onClick={() => onSelectFilter(filter.id)}
              className={cn(
                'flex h-8.25 shrink-0 touch-manipulation items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-sm font-medium md:h-10.75 md:px-4 md:text-base',
                isActive
                  ? 'border-brand-primary bg-brand-primary text-text-inverse'
                  : 'border-background-tertiary bg-background-inverse text-text-primary',
              )}
              aria-pressed={isActive}
            >
              <span>{filter.label}</span>
              <span
                className={
                  isActive ? 'text-text-inverse' : 'text-brand-primary'
                }
              >
                {filter.count}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
