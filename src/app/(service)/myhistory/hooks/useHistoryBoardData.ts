'use client';

/**
 * 완료 이력과 팀/할 일 목록 상세 데이터를 조합해 보드 표시 데이터를 만드는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions, teamQueryOptions } from '@/api/queryOptions';
import useHistoryBoardBaseData from '@/app/(service)/myhistory/hooks/useHistoryBoardBaseData';
import type {
  HistoryTeamDetail,
  UseHistoryBoardDataParams,
} from '@/app/(service)/myhistory/types';
import { getHistoryTaskListDescriptors } from '@/app/(service)/myhistory/utils/historyBoardDataUtils';
import {
  getHistoryTaskListSources,
  getUniqueHistoryTaskListDescriptors,
  hasHistoryQueryError,
  hasHistoryQueryLoading,
} from '@/app/(service)/myhistory/utils/historyBoardQueryUtils';
import {
  getHistorySections,
  getHistorySummaryData,
  toHistoryTeamDetail,
} from '@/app/(service)/myhistory/utils/myHistoryData';

export default function useHistoryBoardData({
  activeFilterId,
  completedTasks,
  shouldLimitTeamQueries,
}: UseHistoryBoardDataParams) {
  const {
    completedDateKeys,
    currentUserId,
    isMembershipsError,
    isMembershipsLoading,
    isMeError,
    isMeLoading,
    uniqueTeams,
  } = useHistoryBoardBaseData(completedTasks);

  const teamDetailQueries = useQueries({
    queries: uniqueTeams.map((team) => teamQueryOptions.detail(team.id)),
  });

  const teamDetails = useMemo(
    () =>
      teamDetailQueries
        .map((query) => toHistoryTeamDetail(query.data))
        .filter((teamDetail): teamDetail is HistoryTeamDetail =>
          Boolean(teamDetail),
        ),
    [teamDetailQueries],
  );

  const taskListDescriptors = useMemo(
    () => getHistoryTaskListDescriptors(teamDetails, completedDateKeys),
    [completedDateKeys, teamDetails],
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

  const historySections = useMemo(
    () => getHistorySections(completedTasks, taskListSources, activeFilterId),
    [activeFilterId, completedTasks, taskListSources],
  );

  const summaryData = useMemo(
    () => getHistorySummaryData(currentUserId, teamDetails, taskListSources),
    [currentUserId, taskListSources, teamDetails],
  );

  return {
    filters: summaryData.filters,
    historySections,
    isError:
      isMeError ||
      isMembershipsError ||
      hasHistoryQueryError(teamDetailQueries) ||
      hasHistoryQueryError(taskListDetailQueries),
    isLoading:
      isMeLoading ||
      isMembershipsLoading ||
      hasHistoryQueryLoading(teamDetailQueries) ||
      hasHistoryQueryLoading(taskListDetailQueries),
    summaryItems: summaryData.items,
  } as const;
}
