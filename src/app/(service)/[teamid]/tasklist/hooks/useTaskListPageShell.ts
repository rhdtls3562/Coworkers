'use client';

import { useCallback, useMemo, useRef, useState } from 'react'; // useRef 추가

import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { createTaskList, deleteTaskList, updateTaskList } from '@/api/taskApi';
import type { TaskListColumnItem } from '@/app/(service)/[teamid]/tasklist/types';
import { useToast } from '@/components/common/toast';
import { useTeamDetailQuery } from '@/hooks/useTeam';

type UseTaskListPageShellParams = {
  teamId: string;
  taskId: string;
};

export default function useTaskListPageShell({
  teamId,
  taskId,
}: UseTaskListPageShellParams) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: groupDetail } = useTeamDetailQuery({ teamId });
  const isCreatingColumnRef = useRef(false); // 추가
  const columns = useMemo<TaskListColumnItem[]>(
    () =>
      (groupDetail?.taskLists ?? [])
        .slice()
        .sort((a, b) => a.displayIndex - b.displayIndex)
        .map((taskList) => ({
          completed: taskList.tasks.filter((task) => task.doneAt !== null)
            .length,
          id: String(taskList.id),
          title: taskList.name,
          total: taskList.tasks.length,
        })),
    [groupDetail?.taskLists],
  );
  const [columnPendingDelete, setColumnPendingDelete] =
    useState<TaskListColumnItem | null>(null);
  const [columnPendingRename, setColumnPendingRename] =
    useState<TaskListColumnItem | null>(null);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const effectiveActiveId = columns.some((column) => column.id === taskId)
    ? taskId
    : (columns[0]?.id ?? '');
  const columnTitle = useMemo(
    () =>
      columns.find((column) => column.id === effectiveActiveId)?.title ??
      '할 일',
    [columns, effectiveActiveId],
  );

  const refetchTaskListPage = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.detail(teamId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.task.lists(teamId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskList.all(teamId),
      }),
      effectiveActiveId
        ? queryClient.invalidateQueries({
            queryKey: queryKeys.taskList.detail(teamId, effectiveActiveId),
          })
        : Promise.resolve(),
    ]);
  }, [effectiveActiveId, queryClient, teamId]);

  const handleConfirmDeleteColumn = useCallback(async () => {
    if (!columnPendingDelete) return;

    const deletedColumnId = columnPendingDelete.id;

    await deleteTaskList(teamId, deletedColumnId);

    queryClient.removeQueries({
      queryKey: queryKeys.taskList.detail(teamId, deletedColumnId),
    });

    setColumnPendingDelete(null);

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.detail(teamId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.task.lists(teamId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskList.all(teamId),
      }),
    ]);

    showToast('삭제되었습니다.', 'error');
  }, [columnPendingDelete, queryClient, showToast, teamId]);

  const handleCreateColumn = useCallback(
    async (name: string) => {
      if (isCreatingColumnRef.current) return;
      isCreatingColumnRef.current = true;
      try {
        await createTaskList(teamId, { name });
        setIsCreateColumnOpen(false);
        await refetchTaskListPage();
        showToast('할일 목록이 생성되었습니다.', 'success');
      } finally {
        isCreatingColumnRef.current = false;
      }
    },
    [refetchTaskListPage, showToast, teamId],
  );

  const handleCreateTask = useCallback(async () => {
    setIsCreateTaskOpen(false);
    await refetchTaskListPage();
    showToast('할일이 생성되었습니다.', 'success');
  }, [refetchTaskListPage, showToast]);

  const handleRenameColumn = useCallback(
    async (name: string) => {
      if (!columnPendingRename) return;
      await updateTaskList(teamId, columnPendingRename.id, { name });
      setColumnPendingRename(null);
      await refetchTaskListPage();
      showToast('변경되었습니다.', 'success');
    },
    [columnPendingRename, refetchTaskListPage, showToast, teamId],
  );

  return {
    columnPendingDelete,
    columnPendingRename,
    columnTitle,
    columns,
    effectiveActiveId,
    groupDetail,
    handleConfirmDeleteColumn,
    handleCreateColumn,
    handleCreateTask,
    handleRenameColumn,
    isCreateColumnOpen,
    isCreateTaskOpen,
    setColumnPendingDelete,
    setColumnPendingRename,
    setIsCreateColumnOpen,
    setIsCreateTaskOpen,
  };
}
