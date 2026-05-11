'use client';

import { useCallback, useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { taskQueryOptions } from '@/api/queryOptions';
import { updateTask } from '@/api/taskApi';
import type { TaskListBoardTask } from '@/app/(service)/[teamid]/tasklist/types';
import { deleteTaskListBoardTask } from '@/app/(service)/[teamid]/tasklist/utils/deleteTaskListBoardTask';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import {
  syncCheckedTaskToGroupDetail,
  syncCheckedTaskToTaskListDetail,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListQueryCache';
import { useToast } from '@/components/common/toast';
import type { GroupDetail } from '@/types/group';
import type { TaskListDetail } from '@/types/task';

export function useTaskListBoard(
  groupId: string | null,
  taskListId: string,
  selectedDate: Date,
) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const dateString = toTaskListDateString(selectedDate);

  const { data: taskListDetail } = useQuery({
    ...taskQueryOptions.taskListDetail(String(groupId), taskListId, {
      date: dateString,
    }),
    enabled: groupId !== null && taskListId !== '',
  });

  const tasks: TaskListBoardTask[] = useMemo(() => {
    if (!taskListDetail?.tasks) return [];
    return taskListDetail.tasks.map((task) => ({
      assigneeImage: task.writer.image,
      id: String(task.id),
      title: task.name,
      checked: task.doneAt !== null,
      commentCount: task.commentCount,
      dueDateLabel: task.date.slice(0, 10),
      frequency: task.frequency,
      recurringId: String(task.recurringId),
      repeatLabel:
        task.frequency === 'ONCE'
          ? ''
          : `매${task.frequency === 'DAILY' ? '일' : task.frequency === 'WEEKLY' ? '주' : '월'} 반복`,
      sortOrder: task.displayIndex,
      assigneeName: task.writer.nickname,
      description: task.description ?? '',
      startedAtLabel: task.date.slice(0, 10),
      taskListId: String(taskListId),
      teamId: groupId ?? '',
      comments: [],
    }));
  }, [taskListDetail, taskListId, groupId]);

  const [taskPendingDelete, setTaskPendingDelete] =
    useState<TaskListBoardTask | null>(null);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks],
  );

  const isTaskListEmpty = sortedTasks.length === 0;

  const handleToggleChecked = useCallback(
    async (id: string, checked: boolean) => {
      if (!groupId) return;
      try {
        await updateTask(groupId, taskListId, id, { done: checked });
        queryClient.setQueryData<GroupDetail | undefined>(
          queryKeys.team.detail(groupId),
          (previousGroupDetail) =>
            syncCheckedTaskToGroupDetail(
              previousGroupDetail,
              taskListId,
              id,
              checked,
            ),
        );
        queryClient.setQueryData<TaskListDetail | undefined>(
          queryKeys.taskList.detail(groupId, taskListId, {
            date: dateString,
          }),
          (previousTaskListDetail) =>
            syncCheckedTaskToTaskListDetail(
              previousTaskListDetail,
              id,
              checked,
            ),
        );
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.taskList.detail(groupId, taskListId, {
              date: dateString,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.taskList.all(groupId),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.team.detail(groupId),
          }),
        ]);
      } catch {
        // TODO: 에러 처리
      }
    },
    [dateString, groupId, taskListId, queryClient],
  );

  const handleRequestDelete = useCallback((task: TaskListBoardTask) => {
    setTaskPendingDelete(task);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setTaskPendingDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!taskPendingDelete || !groupId) return;
    try {
      await deleteTaskListBoardTask(groupId, taskListId, taskPendingDelete);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.taskList.detail(groupId, taskListId, {
            date: dateString,
          }),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.taskList.all(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.team.detail(groupId),
        }),
      ]);
      setTaskPendingDelete(null);
      showToast('삭제되었습니다.', 'error');
    } catch {
      // TODO: 에러 처리
    }
  }, [
    dateString,
    taskPendingDelete,
    groupId,
    taskListId,
    queryClient,
    showToast,
  ]);

  return {
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleRequestDelete,
    handleToggleChecked,
    isTaskListEmpty,
    sortedTasks,
    taskPendingDelete,
  };
}
