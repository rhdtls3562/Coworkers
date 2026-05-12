/**
 * 마이 히스토리 페이지의 전체 배치를 렌더링하는 컴포넌트입니다.
 */

'use client';

import HistoryBoard from '@/app/(service)/myhistory/components/HistoryBoard';
import MyHistorySummary from '@/app/(service)/myhistory/components/MyHistorySummary';
import { MY_HISTORY_PAGE_TITLE } from '@/app/(service)/myhistory/constants';
import useMyHistoryPageContent from '@/app/(service)/myhistory/hooks/useMyHistoryPageContent';
import { PageHeader } from '@/components/common/pageHeader';

export default function MyHistoryPageContent() {
  const {
    activeFilterId,
    datedHistorySections,
    emptyDescription,
    emptyTitle,
    filters,
    handleApplyRange,
    handleMoveMonth,
    handleSelectHistoryFilter,
    hasTasks,
    isError,
    isLoading,
    isProgressivelyLoading,
    selectedRange,
    settingsItems,
    summaryItems,
    summaryTitle,
    title,
  } = useMyHistoryPageContent();

  return (
    <div className="min-h-screen bg-background-secondary px-5 pb-10 pt-14 min-[411px]:px-6.5 md:py-17.5 2xl:px-21 2xl:py-22.5">
      <div className="mx-auto w-full 2xl:mx-0 2xl:w-286.25">
        <PageHeader
          hasSettingsButton
          settingsItems={settingsItems}
          title={MY_HISTORY_PAGE_TITLE}
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
