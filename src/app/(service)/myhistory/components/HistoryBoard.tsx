'use client';

/**
 * 월별 히스토리 목록 카드 영역을 렌더링하는 컴포넌트입니다.
 */

import HistoryDateSection from '@/app/(service)/myhistory/components/HistoryDateSection';
import HistoryFilterTabs from '@/app/(service)/myhistory/components/HistoryFilterTabs';
import HistoryMonthNavigator from '@/app/(service)/myhistory/components/HistoryMonthNavigator';
import type { HistoryBoardProps } from '@/app/(service)/myhistory/types';
import { cn } from '@/utils/cn';

export default function HistoryBoard({
  activeFilterId,
  datedHistorySections,
  filters,
  hasTasks,
  isError,
  isLoading,
  isProgressivelyLoading,
  onApplyRange,
  onMoveMonth,
  onResetRange,
  onSelectFilter,
  selectedRange,
  title,
}: HistoryBoardProps) {
  return (
    <section
      className={cn(
        'w-full rounded-[20px] bg-background-inverse px-4.5 py-8 min-[411px]:px-6 md:px-13 md:py-13 2xl:w-189.5 2xl:shrink-0 2xl:px-9 2xl:py-12',
        !hasTasks &&
          !isLoading &&
          'flex min-h-162.5 flex-col md:min-h-230 2xl:min-h-192',
      )}
    >
      <HistoryMonthNavigator
        title={title}
        selectedRange={selectedRange}
        onApplyRange={onApplyRange}
        onMoveMonth={onMoveMonth}
        onResetRange={onResetRange}
      />

      {filters.length > 0 ? (
        <div className="mt-8 2xl:hidden">
          <HistoryFilterTabs
            activeFilterId={activeFilterId}
            filters={filters}
            onSelectFilter={onSelectFilter}
          />
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-sm font-normal text-text-default">
            내 히스토리를 불러오는 중이에요.
          </p>
        </div>
      ) : isError ? (
        <div className="flex min-h-80 items-center justify-center">
          <div className="text-center text-sm font-normal text-text-default">
            <p>내 히스토리를 불러오지 못했어요.</p>
            <p>잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      ) : hasTasks ? (
        <div className="mt-9 md:mt-12 2xl:mt-10">
          {datedHistorySections.map((section) => (
            <HistoryDateSection key={section.id} section={section} />
          ))}

          {isProgressivelyLoading ? (
            <p className="mt-6 text-center text-sm font-normal text-text-default">
              이전 히스토리를 더 불러오는 중이에요.
            </p>
          ) : null}
        </div>
      ) : isProgressivelyLoading ? (
        <div className="flex min-h-80 flex-1 items-center justify-center">
          <p className="text-sm font-normal text-text-default">
            이전 히스토리를 더 불러오는 중이에요.
          </p>
        </div>
      ) : (
        <div className="flex min-h-80 flex-1 items-center justify-center">
          <div className="text-center text-sm font-normal text-text-default">
            <p>아직 완료된 작업이 없어요.</p>
            <p>하나씩 완료해가며 히스토리를 만들어보세요!</p>
          </div>
        </div>
      )}
    </section>
  );
}
