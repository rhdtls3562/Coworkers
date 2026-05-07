/**
 * 마이 히스토리 페이지의 전체 배치를 렌더링하는 컴포넌트입니다.
 */

'use client';

import { useCallback } from 'react';

import HistoryBoard from '@/app/(service)/myhistory/components/HistoryBoard';
import MyHistorySummary from '@/app/(service)/myhistory/components/MyHistorySummary';
import useHistoryBoard from '@/app/(service)/myhistory/hooks/useHistoryBoard';
import useHistoryFilters from '@/app/(service)/myhistory/hooks/useHistoryFilters';
import { PageHeader } from '@/components/common/pageHeader';

export default function MyHistoryPageContent() {
  const { activeFilterId, handleSelectFilter } = useHistoryFilters();
  const {
    datedHistorySections,
    filters,
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    hasTasks,
    isError,
    isLoading,
    selectedRange,
    summaryItems,
    title,
  } = useHistoryBoard(activeFilterId);
  const handleSelectHistoryFilter = useCallback(
    (filterId: string) => {
      handleResetRange();
      handleSelectFilter(filterId);
    },
    [handleResetRange, handleSelectFilter],
  );

  return (
    <div className="min-h-screen bg-background-secondary px-5 pb-10 pt-14 min-[411px]:px-6.5 md:py-17.5 2xl:px-21 2xl:py-22.5">
      <div className="mx-auto w-full 2xl:mx-0 2xl:w-286.25">
        <PageHeader title="내 히스토리" />

        <div className="mt-8 flex flex-col gap-10 2xl:mt-12 2xl:flex-row 2xl:items-start 2xl:gap-20.75">
          <MyHistorySummary
            activeItemId={activeFilterId}
            items={summaryItems}
            onSelectItem={handleSelectHistoryFilter}
          />
          <HistoryBoard
            activeFilterId={activeFilterId}
            datedHistorySections={datedHistorySections}
            filters={filters}
            hasTasks={hasTasks}
            isError={isError}
            isLoading={isLoading}
            onApplyRange={handleApplyRange}
            onMoveMonth={handleMoveMonth}
            onResetRange={handleResetRange}
            onSelectFilter={handleSelectHistoryFilter}
            selectedRange={selectedRange}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
