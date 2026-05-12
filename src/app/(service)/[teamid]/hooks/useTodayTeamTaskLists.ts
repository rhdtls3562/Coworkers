'use client';

/**
 * 팀 메인 화면에서 오늘 날짜 기준 task list 데이터를 조회하는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import type { TeamDetailData } from '@/app/(service)/[teamid]/types';
import { toTodayTeamTaskLists } from '@/app/(service)/[teamid]/utils/todayTeamTaskLists';

type UseTodayTeamTaskListsParams = {
  teamData?: TeamDetailData;
  teamId: string;
};

export default function useTodayTeamTaskLists({
  teamData,
  teamId,
}: UseTodayTeamTaskListsParams) {
  const todayDateString = useMemo(() => toTaskListDateString(new Date()), []);
  const taskListDetailQueries = useQueries({
    queries: (teamData?.taskLists ?? []).map((taskList) =>
      taskQueryOptions.taskListDetail(
        teamId,
        String(taskList.id),
        {
          date: todayDateString,
        },
        {
          enabled: taskList.tasks.length > 0,
        },
      ),
    ),
  });

  const todayTaskLists = useMemo(
    () =>
      toTodayTeamTaskLists(
        teamData?.taskLists ?? [],
        taskListDetailQueries.map((query) => query.data),
      ),
    [taskListDetailQueries, teamData?.taskLists],
  );

  return {
    isError: taskListDetailQueries.some((query) => query.isError),
    isLoading: taskListDetailQueries.some((query) => query.isLoading),
    todayTaskLists,
  } as const;
}
