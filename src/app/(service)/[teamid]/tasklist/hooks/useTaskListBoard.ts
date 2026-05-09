'use client';

import { useCallback, useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import { deleteTask, updateTask } from '@/api/taskApi';
import type { TaskListBoardTask } from '@/app/(service)/[teamid]/tasklist/types';
import { useToast } from '@/components/common/toast';

export function useTaskListBoard(groupId: number | null, taskListId: string) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const dateString = selectedDate.toISOString().slice(0, 10);

  const { data: taskListDetail } = useQuery({
    ...taskQueryOptions.taskListDetail(String(groupId), taskListId, {
      date: dateString,
    }),
    enabled: groupId !== null && taskListId !== '',
  });

  const tasks: TaskListBoardTask[] = useMemo(() => {
    if (!taskListDetail?.tasks) return [];
    return taskListDetail.tasks.map((task) => ({
      id: String(task.id),
      title: task.name,
      checked: task.doneAt !== null,
      commentCount: task.commentCount,
      dueDateLabel: task.date.slice(0, 10),
      repeatLabel:
        task.frequency === 'ONCE'
          ? ''
          : `매${task.frequency === 'DAILY' ? '일' : task.frequency === 'WEEKLY' ? '주' : '월'} 반복`,
      sortOrder: task.displayIndex,
      assigneeName: task.writer.nickname,
      description: task.description ?? '',
      startedAtLabel: task.date.slice(0, 10),
      taskListId: String(taskListId),
      teamId: String(groupId),
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
        await updateTask(String(groupId), taskListId, id, { done: checked });
        await queryClient.invalidateQueries({ queryKey: ['teams'] });
      } catch {
        // TODO: 에러 처리
      }
    },
    [groupId, taskListId, queryClient],
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
      await deleteTask(String(groupId), taskListId, taskPendingDelete.id);
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
      setTaskPendingDelete(null);
      showToast('삭제되었습니다.', 'error');
    } catch {
      // TODO: 에러 처리
    }
  }, [taskPendingDelete, groupId, taskListId, queryClient, showToast]);

  return {
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleRequestDelete,
    handleToggleChecked,
    isTaskListEmpty,
    selectedDate,
    setSelectedDate,
    sortedTasks,
    taskPendingDelete,
  };
}
