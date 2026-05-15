/**
 * 리스트 페이지 보드의 조회·체크 토글·삭제 처리 훅입니다.
 */

import { useCallback, useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import useTaskListRecurringWeekDaysQuery from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListRecurringWeekDaysQuery';
import type {
  TaskListBoardTask,
  UseTaskListBoardQueryParams,
} from '@/app/(service)/[teamid]/tasklist/types';
import {
  toTaskListDateKey,
  toTaskListDateString,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { formatTaskListRepeatLabel } from '@/app/(service)/[teamid]/tasklist/utils/taskListRepeatLabel';
import { useToast } from '@/components/common/toast';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/hooks/useTask';

export function useTaskListBoardQuery({
  groupId,
  selectedDate,
  taskListId,
}: UseTaskListBoardQueryParams) {
  const { showToast } = useToast();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
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
      const recurringId =
        typeof task.recurringId === 'number' && task.recurringId > 0
          ? String(task.recurringId)
          : null;

      return {
        assigneeImage: task.writer.image,
        id: String(task.id),
        title: task.name,
        checked: task.doneAt !== null,
        commentCount: task.commentCount,
        dueDateLabel: toTaskListDateKey(task.date),
        frequency: task.frequency,
        recurringId,
        repeatLabel: formatTaskListRepeatLabel(
          task.frequency,
          resolvedWeekDays,
        ),
        sortOrder: task.displayIndex,
        assigneeName: task.writer.nickname,
        description: task.description ?? '',
        startDate: task.startDate,
        startedAtRaw: task.date,
        startedAtLabel: toTaskListDateKey(task.date),
        taskListId: String(taskListId),
        teamId: groupId ?? '',
        comments: [],
        weekDays: resolvedWeekDays,
        updatedAt: task.updatedAt,
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
      await deleteTaskMutation.mutateAsync({
        recurringId: taskPendingDelete.recurringId,
        taskId: taskPendingDelete.id,
        taskListId,
        teamId: groupId,
      });
      setTaskPendingDelete(null);
      showToast('삭제되었습니다.', 'error');
    } catch {
      // TODO: 에러 처리
    }
  }, [deleteTaskMutation, groupId, showToast, taskListId, taskPendingDelete]);

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
