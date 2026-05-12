/**
 * 마이 히스토리 페이지 콘텐츠에 필요한 보기 상태와 액션을 조합하는 훅입니다.
 */

import { useCallback, useMemo, useState } from 'react';

import {
  MY_HISTORY_SUMMARY_TITLES,
  MY_HISTORY_VIEW_MODES,
  MY_HISTORY_VIEW_SETTINGS,
} from '@/app/(service)/myhistory/constants';
import useHistoryBoardQuery from '@/app/(service)/myhistory/hooks/useHistoryBoardQuery';
import useHistoryFilters from '@/app/(service)/myhistory/hooks/useHistoryFilters';
import type { MyHistoryViewMode } from '@/app/(service)/myhistory/types';
import type { ListDropdownItem } from '@/components/common/dropdown/types';

export default function useMyHistoryPageContent() {
  const { activeFilterId, handleSelectFilter } = useHistoryFilters();
  const [viewMode, setViewMode] = useState<MyHistoryViewMode>(
    MY_HISTORY_VIEW_MODES.COMPLETED,
  );
  const { handleResetRange, ...historyBoard } = useHistoryBoardQuery(
    activeFilterId,
    viewMode,
  );

  const handleSelectHistoryFilter = useCallback(
    (filterId: string) => {
      handleResetRange();
      handleSelectFilter(filterId);
    },
    [handleResetRange, handleSelectFilter],
  );

  const handleSelectViewMode = useCallback(
    (nextViewMode: MyHistoryViewMode) => {
      handleResetRange();
      setViewMode(nextViewMode);
    },
    [handleResetRange],
  );

  const settingsItems = useMemo<ListDropdownItem[]>(
    () =>
      MY_HISTORY_VIEW_SETTINGS.map((item) => ({
        label: item.label,
        onClick: () => handleSelectViewMode(item.value),
      })),
    [handleSelectViewMode],
  );

  return {
    ...historyBoard,
    activeFilterId,
    handleSelectHistoryFilter,
    settingsItems,
    summaryTitle: MY_HISTORY_SUMMARY_TITLES[viewMode],
  } as const;
}
