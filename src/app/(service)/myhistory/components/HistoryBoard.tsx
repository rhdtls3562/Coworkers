/**
 * 월별 히스토리 목록 카드 영역을 렌더링하는 컴포넌트입니다.
 */

import HistoryDateSection from '@/app/(service)/myhistory/components/HistoryDateSection';
import HistoryFilterTabs from '@/app/(service)/myhistory/components/HistoryFilterTabs';
import HistoryMonthNavigator from '@/app/(service)/myhistory/components/HistoryMonthNavigator';
import { MY_HISTORY_BOARD_STATUS_TEXT } from '@/app/(service)/myhistory/constants';
import type { HistoryBoardProps } from '@/app/(service)/myhistory/types';

export default function HistoryBoard({
  activeFilterId,
  datedHistorySections,
  emptyDescription,
  emptyTitle,
  filters,
  hasTasks,
  isError,
  isLoading,
  isProgressivelyLoading,
  onApplyRange,
  onMoveMonth,
  onSelectFilter,
  selectedRange,
  title,
}: HistoryBoardProps) {
  return (
    <section className="w-full rounded-[20px] bg-background-inverse px-4.5 py-8 min-[411px]:px-6 md:px-13 md:py-13 2xl:w-189.5 2xl:shrink-0 2xl:px-9 2xl:py-12">
      <HistoryMonthNavigator
        title={title}
        selectedRange={selectedRange}
        onApplyRange={onApplyRange}
        onMoveMonth={onMoveMonth}
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
            {MY_HISTORY_BOARD_STATUS_TEXT.loading}
          </p>
        </div>
      ) : isError ? (
        <div className="flex min-h-80 items-center justify-center">
          <div className="text-center text-sm font-normal text-text-default">
            <p>{MY_HISTORY_BOARD_STATUS_TEXT.errorTitle}</p>
            <p>{MY_HISTORY_BOARD_STATUS_TEXT.errorDescription}</p>
          </div>
        </div>
      ) : hasTasks ? (
        <div className="mt-9 md:mt-12 2xl:mt-10">
          {datedHistorySections.map((section) => (
            <HistoryDateSection key={section.id} section={section} />
          ))}

          {isProgressivelyLoading ? (
            <p className="mt-6 text-center text-sm font-normal text-text-default">
              {MY_HISTORY_BOARD_STATUS_TEXT.progressiveLoading}
            </p>
          ) : null}
        </div>
      ) : isProgressivelyLoading ? (
        <div className="flex min-h-80 flex-1 items-center justify-center">
          <p className="text-sm font-normal text-text-default">
            {MY_HISTORY_BOARD_STATUS_TEXT.progressiveLoading}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-50">
          <div className="text-center text-sm font-normal text-text-default">
            <p>{emptyTitle}</p>
            <p>{emptyDescription}</p>
          </div>
        </div>
      )}
    </section>
  );
}
