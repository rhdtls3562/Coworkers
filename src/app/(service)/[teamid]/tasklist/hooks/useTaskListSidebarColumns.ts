/**
 * 리스트 페이지 사이드바의 진행 카운트를 현재 선택 날짜 기준으로 계산하는 훅입니다.
 */

'use client';

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import type { TaskListColumnItem } from '@/app/(service)/[teamid]/tasklist/types';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import type { TaskListSummary } from '@/types/task';

type UseTaskListSidebarColumnsParams = {
  selectedDate: Date;
  taskLists: readonly TaskListSummary[];
  teamId: string;
};

export default function useTaskListSidebarColumns({
  selectedDate,
  taskLists,
  teamId,
}: UseTaskListSidebarColumnsParams) {
  const dateString = toTaskListDateString(selectedDate);
  const taskListDetailQueries = useQueries({
    queries: taskLists.map((taskList) =>
      taskQueryOptions.taskListDetail(teamId, String(taskList.id), {
        date: dateString,
      }),
    ),
  });

  return useMemo<TaskListColumnItem[]>(
    () =>
      taskLists
        .slice()
        .sort((a, b) => a.displayIndex - b.displayIndex)
        .map((taskList, index) => {
          const taskListDetail = taskListDetailQueries[index]?.data;
          const tasks = taskListDetail ? taskListDetail.tasks : taskList.tasks;

          return {
            completed: tasks.filter((task) => task.doneAt !== null).length,
            id: String(taskList.id),
            title: taskList.name,
            total: tasks.length,
          };
        }),
    [taskListDetailQueries, taskLists],
  );
}
