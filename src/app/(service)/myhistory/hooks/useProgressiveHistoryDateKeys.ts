/**
 * 전체 보기에서 완료 날짜 키를 최근순으로 일부만 먼저 노출하고,
 * 나머지는 짧은 간격으로 점진적으로 확장하는 훅입니다.
 */

import { useEffect, useMemo, useState } from 'react';

import { HISTORY_PROGRESSIVE_DATE_KEY_SETTINGS } from '@/app/(service)/myhistory/constants';
import { sortHistoryDateKeysByRecency } from '@/app/(service)/myhistory/utils/historyBoardDataUtils';

export default function useProgressiveHistoryDateKeys(
  completedDateKeys: readonly string[],
  isAllMode: boolean,
) {
  const sortedDateKeys = useMemo(
    () => sortHistoryDateKeysByRecency(completedDateKeys),
    [completedDateKeys],
  );
  const initialVisibleCount = isAllMode
    ? Math.min(
        HISTORY_PROGRESSIVE_DATE_KEY_SETTINGS.initialVisibleDateCount,
        sortedDateKeys.length,
      )
    : sortedDateKeys.length;
  const sourceKey = `${isAllMode}:${sortedDateKeys.join(',')}`;
  const [progressState, setProgressState] = useState({
    sourceKey,
    visibleCount: initialVisibleCount,
  });
  const visibleCount =
    progressState.sourceKey === sourceKey
      ? progressState.visibleCount
      : initialVisibleCount;

  useEffect(() => {
    if (progressState.sourceKey === sourceKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setProgressState({
        sourceKey,
        visibleCount: initialVisibleCount,
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [initialVisibleCount, progressState.sourceKey, sourceKey]);

  useEffect(() => {
    if (
      progressState.sourceKey !== sourceKey ||
      !isAllMode ||
      visibleCount >= sortedDateKeys.length
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setProgressState((previousState) => ({
        ...previousState,
        visibleCount: Math.min(
          previousState.visibleCount +
            HISTORY_PROGRESSIVE_DATE_KEY_SETTINGS.visibleDateChunkSize,
          sortedDateKeys.length,
        ),
      }));
    }, HISTORY_PROGRESSIVE_DATE_KEY_SETTINGS.visibleDateExpandDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    isAllMode,
    progressState.sourceKey,
    sortedDateKeys.length,
    sourceKey,
    visibleCount,
  ]);

  return {
    isProgressivelyLoading: isAllMode && visibleCount < sortedDateKeys.length,
    visibleDateKeys: isAllMode
      ? sortedDateKeys.slice(0, visibleCount)
      : sortedDateKeys,
  } as const;
}
