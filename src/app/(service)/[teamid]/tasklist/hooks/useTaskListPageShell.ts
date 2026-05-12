'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { createTaskList, deleteTaskList, updateTaskList } from '@/api/taskApi';
import useTeamRouteGuard from '@/app/(service)/[teamid]/hooks/useTeamRouteGuard';
import useTaskListSidebarColumns from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListSidebarColumns';
import type { TaskListColumnItem } from '@/app/(service)/[teamid]/tasklist/types';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { removeTaskListFromGroupDetail } from '@/app/(service)/[teamid]/tasklist/utils/taskListQueryCache';
import { resolveTeamExitRoute } from '@/app/(service)/[teamid]/utils/teamRouteAccess';
import { useToast } from '@/components/common/toast';
import { useTeamDetailQuery } from '@/hooks/useTeam';
import type { GroupDetail } from '@/types/group';

type UseTaskListPageShellParams = {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  teamId: string;
  taskId: string;
};

export default function useTaskListPageShell({
  onSelectDate,
  selectedDate,
  teamId,
  taskId,
}: UseTaskListPageShellParams) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const {
    hasMemberships,
    isAccessible,
    isLoading: isTeamRouteLoading,
    meData,
  } = useTeamRouteGuard({ teamId });
  const { data: groupDetail } = useTeamDetailQuery({
    teamId,
    options: {
      enabled: hasMemberships && isAccessible,
    },
  });
  const isCreatingColumnRef = useRef(false);
  const columns = useTaskListSidebarColumns({
    selectedDate,
    taskLists: groupDetail?.taskLists ?? [],
    teamId,
  });
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

  const refetchTaskListPage = useCallback(
    async (targetDate = selectedDate) => {
      const targetDateString = toTaskListDateString(targetDate);

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
              queryKey: queryKeys.taskList.detail(teamId, effectiveActiveId, {
                date: targetDateString,
              }),
            })
          : Promise.resolve(),
      ]);
    },
    [effectiveActiveId, queryClient, selectedDate, teamId],
  );

  const handleConfirmDeleteColumn = useCallback(async () => {
    if (!columnPendingDelete) return;

    const deletedColumnId = columnPendingDelete.id;

    await deleteTaskList(teamId, deletedColumnId);

    queryClient.setQueryData<GroupDetail | undefined>(
      queryKeys.team.detail(teamId),
      (previousGroupDetail) =>
        removeTaskListFromGroupDetail(previousGroupDetail, deletedColumnId),
    );

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

  const handleCreateTask = useCallback(
    async (createdDate: Date) => {
      setIsCreateTaskOpen(false);
      onSelectDate(new Date(createdDate));
      await refetchTaskListPage(createdDate);
      showToast('할일이 생성되었습니다.', 'success');
    },
    [onSelectDate, refetchTaskListPage, showToast],
  );

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
    hasAccessibleTeamRoute: isAccessible,
    handleConfirmDeleteColumn,
    handleCreateColumn,
    handleCreateTask,
    handleRenameColumn,
    isTeamRouteLoading,
    isCreateColumnOpen,
    isCreateTaskOpen,
    leaveFallbackRoute: resolveTeamExitRoute(teamId, meData?.memberships),
    setColumnPendingDelete,
    setColumnPendingRename,
    setIsCreateColumnOpen,
    setIsCreateTaskOpen,
  };
}
