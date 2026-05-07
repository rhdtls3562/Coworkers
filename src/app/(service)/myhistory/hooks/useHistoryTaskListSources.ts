'use client';

/**
 * 히스토리 보드 표시에 필요한 할 일 목록 상세 데이터 소스를 조회하는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import type { HistoryTeamDetail } from '@/app/(service)/myhistory/types';
import { getHistoryTaskListDescriptors } from '@/app/(service)/myhistory/utils/historyBoardDataUtils';
import {
  getHistoryTaskListSources,
  getUniqueHistoryTaskListDescriptors,
  hasHistoryQueryError,
  hasHistoryQueryLoading,
} from '@/app/(service)/myhistory/utils/historyBoardQueryUtils';

type UseHistoryTaskListSourcesParams = {
  activeFilterId: string | null;
  shouldLimitTeamQueries: boolean;
  teamDetails: readonly HistoryTeamDetail[];
  visibleDateKeys: readonly string[];
};

export default function useHistoryTaskListSources({
  activeFilterId,
  shouldLimitTeamQueries,
  teamDetails,
  visibleDateKeys,
}: UseHistoryTaskListSourcesParams) {
  const taskListDescriptors = useMemo(
    () => getHistoryTaskListDescriptors(teamDetails, visibleDateKeys),
    [teamDetails, visibleDateKeys],
  );
  const uniqueTaskListDescriptors = useMemo(
    () => getUniqueHistoryTaskListDescriptors(taskListDescriptors),
    [taskListDescriptors],
  );
  const taskListDetailQueries = useQueries({
    queries: uniqueTaskListDescriptors.map((descriptor) =>
      taskQueryOptions.taskListDetail(
        descriptor.teamId,
        descriptor.taskListId,
        { date: descriptor.dateKey },
        {
          enabled:
            Boolean(descriptor.teamId) &&
            Boolean(descriptor.taskListId) &&
            Boolean(descriptor.dateKey) &&
            (!shouldLimitTeamQueries || descriptor.teamId === activeFilterId),
        },
      ),
    ),
  });
  const taskListSources = useMemo(
    () =>
      getHistoryTaskListSources(
        uniqueTaskListDescriptors,
        taskListDetailQueries,
      ),
    [uniqueTaskListDescriptors, taskListDetailQueries],
  );

  return {
    isError: hasHistoryQueryError(taskListDetailQueries),
    isLoading: hasHistoryQueryLoading(taskListDetailQueries),
    taskListSources,
  } as const;
}
