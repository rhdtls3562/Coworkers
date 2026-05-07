'use client';

/**
 * 전체 보기에서 완료 날짜 키를 최근순으로 일부만 먼저 노출하고,
 * 나머지는 짧은 간격으로 점진적으로 확장하는 훅입니다.
 */

import { useEffect, useMemo, useState } from 'react';

import { sortHistoryDateKeysByRecency } from '@/app/(service)/myhistory/utils/historyBoardDataUtils';

const INITIAL_VISIBLE_DATE_COUNT = 2;
const VISIBLE_DATE_CHUNK_SIZE = 2;
const VISIBLE_DATE_EXPAND_DELAY = 120;

export default function useProgressiveHistoryDateKeys(
  completedDateKeys: readonly string[],
  isAllMode: boolean,
) {
  const sortedDateKeys = useMemo(
    () => sortHistoryDateKeysByRecency(completedDateKeys),
    [completedDateKeys],
  );
  const initialVisibleCount = isAllMode
    ? Math.min(INITIAL_VISIBLE_DATE_COUNT, sortedDateKeys.length)
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
          previousState.visibleCount + VISIBLE_DATE_CHUNK_SIZE,
          sortedDateKeys.length,
        ),
      }));
    }, VISIBLE_DATE_EXPAND_DELAY);

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
