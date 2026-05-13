/**
 * 리스트 페이지 사이드바의 진행 카운트를 현재 선택 날짜 기준으로 계산하는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import { getTaskListDetail } from '@/api/taskApi';
import type {
  TaskListColumnItem,
  UseTaskListSidebarColumnsQueryParams,
} from '@/app/(service)/[teamid]/tasklist/types';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import {
  createEmptyTaskListDetail,
  isTaskListNotFoundError,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListSidebarColumns';

export default function useTaskListSidebarColumnsQuery({
  selectedDate,
  taskLists,
  teamId,
}: UseTaskListSidebarColumnsQueryParams) {
  const dateString = toTaskListDateString(selectedDate);
  const sortedTaskLists = useMemo(
    () =>
      taskLists.slice().sort((firstTaskList, secondTaskList) => {
        return firstTaskList.displayIndex - secondTaskList.displayIndex;
      }),
    [taskLists],
  );
  const taskListDetailQueries = useQueries({
    queries: sortedTaskLists.map((taskList) => {
      const baseQuery = taskQueryOptions.taskListDetail(
        teamId,
        String(taskList.id),
        {
          date: dateString,
        },
      );

      return {
        ...baseQuery,
        queryFn: async () => {
          try {
            return await getTaskListDetail(teamId, String(taskList.id), {
              date: dateString,
            });
          } catch (error) {
            if (isTaskListNotFoundError(error) && error.status === 404) {
              return createEmptyTaskListDetail(taskList);
            }

            throw error;
          }
        },
      };
    }),
  });

  return useMemo<TaskListColumnItem[]>(
    () =>
      sortedTaskLists.map((taskList, index) => {
        const tasks = taskListDetailQueries[index]?.data?.tasks ?? [];

        return {
          completed: tasks.filter((task) => task.doneAt !== null).length,
          id: String(taskList.id),
          title: taskList.name,
          total: tasks.length,
        };
      }),
    [sortedTaskLists, taskListDetailQueries],
  );
}
