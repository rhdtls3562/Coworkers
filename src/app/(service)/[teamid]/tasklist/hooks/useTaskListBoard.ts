'use client';

import { useCallback, useMemo, useState } from 'react';

import { TASK_LIST_INITIAL_TASKS } from '@/app/(service)/[teamid]/tasklist/constants';
import type {
  TaskListBoardTask,
  TaskListTaskDetailApplyPatch,
} from '@/app/(service)/[teamid]/tasklist/types';
import { useToast } from '@/components/common/toast';

export function useTaskListBoard() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [tasks, setTasks] = useState<TaskListBoardTask[]>(
    () => TASK_LIST_INITIAL_TASKS,
  );
  const [taskPendingDelete, setTaskPendingDelete] =
    useState<TaskListBoardTask | null>(null);

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.sortOrder - b.sortOrder),
    [tasks],
  );

  const isTaskListEmpty = sortedTasks.length === 0;

  const handleToggleChecked = useCallback((id: string, checked: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, checked } : t)));
  }, []);

  const handleRequestDelete = useCallback((task: TaskListBoardTask) => {
    setTaskPendingDelete(task);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setTaskPendingDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!taskPendingDelete) return;
    const id = taskPendingDelete.id;
    setTaskPendingDelete(null);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('삭제되었습니다.', 'error');
  }, [taskPendingDelete, showToast]);

  const handleSyncTaskDetail = useCallback(
    (taskId: string, patch: TaskListTaskDetailApplyPatch) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                title: patch.title,
                description: patch.description,
              }
            : t,
        ),
      );
    },
    [],
  );

  const handleSyncTaskChecked = useCallback(
    (taskId: string, checked: boolean) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, checked } : t)),
      );
    },
    [],
  );

  const handleRemoveTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  return {
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleRemoveTask,
    handleRequestDelete,
    handleSyncTaskChecked,
    handleSyncTaskDetail,
    handleToggleChecked,
    isTaskListEmpty,
    selectedDate,
    setSelectedDate,
    sortedTasks,
    taskPendingDelete,
  };
}
