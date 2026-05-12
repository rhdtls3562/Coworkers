/**
 * 리스트 페이지 사이드바의 진행 카운트를 현재 선택 날짜 기준으로 계산하는 훅입니다.
 */

'use client';

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import { getTaskListDetail } from '@/api/taskApi';
import type { ApiError } from '@/api/types';
import type { TaskListColumnItem } from '@/app/(service)/[teamid]/tasklist/types';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import type { TaskListDetail, TaskListSummary } from '@/types/task';

type UseTaskListSidebarColumnsParams = {
  selectedDate: Date;
  taskLists: readonly TaskListSummary[];
  teamId: string;
};

function isNotFoundError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function createEmptyTaskListDetail(taskList: TaskListSummary): TaskListDetail {
  return {
    createdAt: taskList.createdAt,
    displayIndex: taskList.displayIndex,
    groupId: taskList.groupId,
    id: taskList.id,
    name: taskList.name,
    tasks: [],
    updatedAt: taskList.updatedAt,
  };
}

export default function useTaskListSidebarColumns({
  selectedDate,
  taskLists,
  teamId,
}: UseTaskListSidebarColumnsParams) {
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
            if (isNotFoundError(error) && error.status === 404) {
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
