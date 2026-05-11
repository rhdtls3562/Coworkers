/**
 * 마이 히스토리 페이지의 전체 배치를 렌더링하는 컴포넌트입니다.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';

import HistoryBoard from '@/app/(service)/myhistory/components/HistoryBoard';
import MyHistorySummary from '@/app/(service)/myhistory/components/MyHistorySummary';
import { MY_HISTORY_VIEW_MODES } from '@/app/(service)/myhistory/constants';
import useHistoryBoard from '@/app/(service)/myhistory/hooks/useHistoryBoard';
import useHistoryFilters from '@/app/(service)/myhistory/hooks/useHistoryFilters';
import type { MyHistoryViewMode } from '@/app/(service)/myhistory/types';
import { PageHeader } from '@/components/common/pageHeader';

export default function MyHistoryPageContent() {
  const { activeFilterId, handleSelectFilter } = useHistoryFilters();
  const [viewMode, setViewMode] = useState<MyHistoryViewMode>(
    MY_HISTORY_VIEW_MODES.COMPLETED,
  );
  const {
    datedHistorySections,
    emptyDescription,
    emptyTitle,
    filters,
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    hasTasks,
    isError,
    isLoading,
    isProgressivelyLoading,
    selectedRange,
    summaryItems,
    title,
  } = useHistoryBoard(activeFilterId, viewMode);
  const handleSelectHistoryFilter = useCallback(
    (filterId: string) => {
      handleResetRange();
      handleSelectFilter(filterId);
    },
    [handleResetRange, handleSelectFilter],
  );
  const settingsItems = useMemo(
    () => [
      {
        label: '내가 한 일',
        onClick: () => setViewMode(MY_HISTORY_VIEW_MODES.COMPLETED),
      },
      {
        label: '앞으로 할 일',
        onClick: () => setViewMode(MY_HISTORY_VIEW_MODES.PENDING),
      },
    ],
    [],
  );
  const summaryTitle =
    viewMode === MY_HISTORY_VIEW_MODES.PENDING ? '앞으로 할 일' : '내가 한 일';

  return (
    <div className="min-h-screen bg-background-secondary px-5 pb-10 pt-14 min-[411px]:px-6.5 md:py-17.5 2xl:px-21 2xl:py-22.5">
      <div className="mx-auto w-full 2xl:mx-0 2xl:w-286.25">
        <PageHeader
          hasSettingsButton
          settingsItems={settingsItems}
          title="내 히스토리"
        />

        <div className="mt-8 flex flex-col gap-10 2xl:mt-12 2xl:flex-row 2xl:items-start 2xl:gap-20.75">
          <MyHistorySummary
            activeItemId={activeFilterId}
            items={summaryItems}
            onSelectItem={handleSelectHistoryFilter}
            title={summaryTitle}
          />
          <HistoryBoard
            activeFilterId={activeFilterId}
            datedHistorySections={datedHistorySections}
            emptyDescription={emptyDescription}
            emptyTitle={emptyTitle}
            filters={filters}
            hasTasks={hasTasks}
            isError={isError}
            isLoading={isLoading}
            isProgressivelyLoading={isProgressivelyLoading}
            onApplyRange={handleApplyRange}
            onMoveMonth={handleMoveMonth}
            onSelectFilter={handleSelectHistoryFilter}
            selectedRange={selectedRange}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
