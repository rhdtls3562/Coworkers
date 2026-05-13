/**
 * 리스트 페이지 보드의 조회·체크 토글·삭제 처리 훅입니다.
 */

import { useCallback, useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { taskQueryOptions } from '@/api/queryOptions';
import useTaskListRecurringWeekDaysQuery from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListRecurringWeekDaysQuery';
import type {
  TaskListBoardTask,
  UseTaskListBoardQueryParams,
} from '@/app/(service)/[teamid]/tasklist/types';
import { deleteTaskListBoardTask } from '@/app/(service)/[teamid]/tasklist/utils/deleteTaskListBoardTask';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { formatTaskListRepeatLabel } from '@/app/(service)/[teamid]/tasklist/utils/taskListRepeatLabel';
import { useToast } from '@/components/common/toast';
import { useUpdateTaskMutation } from '@/hooks/useTask';

export function useTaskListBoardQuery({
  groupId,
  selectedDate,
  taskListId,
}: UseTaskListBoardQueryParams) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const updateTaskMutation = useUpdateTaskMutation();
  const dateString = toTaskListDateString(selectedDate);

  const { data: taskListDetail } = useQuery({
    ...taskQueryOptions.taskListDetail(String(groupId), taskListId, {
      date: dateString,
    }),
    enabled: groupId !== null && taskListId !== '',
  });
  const inferredRecurringWeekDays = useTaskListRecurringWeekDaysQuery({
    groupId,
    selectedDate,
    taskListDetail,
    taskListId,
  });

  const tasks: TaskListBoardTask[] = useMemo(() => {
    if (!taskListDetail?.tasks) return [];
    return taskListDetail.tasks.map((task) => {
      const resolvedWeekDays =
        task.weekDays && task.weekDays.length > 0
          ? task.weekDays
          : inferredRecurringWeekDays[String(task.recurringId)];

      return {
        assigneeImage: task.writer.image,
        id: String(task.id),
        title: task.name,
        checked: task.doneAt !== null,
        commentCount: task.commentCount,
        dueDateLabel: task.date.slice(0, 10),
        frequency: task.frequency,
        recurringId: String(task.recurringId),
        repeatLabel: formatTaskListRepeatLabel(
          task.frequency,
          resolvedWeekDays,
        ),
        sortOrder: task.displayIndex,
        assigneeName: task.writer.nickname,
        description: task.description ?? '',
        startedAtLabel: task.date.slice(0, 10),
        taskListId: String(taskListId),
        teamId: groupId ?? '',
        comments: [],
        weekDays: resolvedWeekDays,
      };
    });
  }, [groupId, inferredRecurringWeekDays, taskListDetail, taskListId]);

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
        await updateTaskMutation.mutateAsync({
          body: { done: checked },
          taskId: id,
          taskListId,
          teamId: groupId,
        });
      } catch {
        // TODO: 에러 처리
      }
    },
    [groupId, taskListId, updateTaskMutation],
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
