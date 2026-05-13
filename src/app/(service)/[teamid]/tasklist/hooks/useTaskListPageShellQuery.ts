/**
 * 리스트 페이지 셸에서 사용하는 팀 상세 조회·목록 관리 훅입니다.
 */

import { useCallback, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { deleteGroup } from '@/api/groupApi';
import { queryKeys } from '@/api/queryKeys';
import { refetchUserQueries } from '@/api/queryRefetch';
import { createTaskList, deleteTaskList, updateTaskList } from '@/api/taskApi';
import useTeamRouteGuard from '@/app/(service)/[teamid]/hooks/useTeamRouteGuard';
import useTaskListSidebarColumnsQuery from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListSidebarColumnsQuery';
import type {
  TaskListColumnItem,
  UseTaskListPageShellQueryParams,
} from '@/app/(service)/[teamid]/tasklist/types';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { removeTaskListFromGroupDetail } from '@/app/(service)/[teamid]/tasklist/utils/taskListQueryCache';
import { resolveTeamExitRoute } from '@/app/(service)/[teamid]/utils/teamRouteAccess';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useTeamDetailQuery } from '@/hooks/useTeam';
import type { GroupDetail } from '@/types/group';

export default function useTaskListPageShellQuery({
  onSelectDate,
  selectedDate,
  teamId,
  taskId,
}: UseTaskListPageShellQueryParams) {
  const router = useRouter();
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
  const columns = useTaskListSidebarColumnsQuery({
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

  const leaveFallbackRoute = resolveTeamExitRoute(teamId, meData?.memberships);

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

  const handleConfirmDeleteColumnWithNavigation = useCallback(async () => {
    if (!columnPendingDelete) {
      return;
    }

    const wasActive = columnPendingDelete.id === taskId;
    const nextColumnId = columns.find(
      (column) => column.id !== columnPendingDelete.id,
    )?.id;

    await handleConfirmDeleteColumn();

    if (!wasActive) {
      return;
    }

    router.replace(
      nextColumnId
        ? ROUTES.TASK_LIST_ITEM(teamId, nextColumnId)
        : ROUTES.TEAM(teamId),
    );
  }, [
    columnPendingDelete,
    columns,
    handleConfirmDeleteColumn,
    router,
    taskId,
    teamId,
  ]);

  const handleConfirmTeamPageDelete = useCallback(async () => {
    await deleteGroup(teamId);
    await refetchUserQueries(queryClient);
    showToast('삭제되었습니다.', 'error');
    router.replace(leaveFallbackRoute);
  }, [leaveFallbackRoute, queryClient, router, showToast, teamId]);

  return {
    columnPendingDelete,
    columnPendingRename,
    columnTitle,
    columns,
    effectiveActiveId,
    groupDetail,
    hasAccessibleTeamRoute: isAccessible,
    handleConfirmDeleteColumn,
    handleConfirmDeleteColumnWithNavigation,
    handleCreateColumn,
    handleCreateTask,
    handleConfirmTeamPageDelete,
    handleRenameColumn,
    isTeamRouteLoading,
    isCreateColumnOpen,
    isCreateTaskOpen,
    leaveFallbackRoute,
    setColumnPendingDelete,
    setColumnPendingRename,
    setIsCreateColumnOpen,
    setIsCreateTaskOpen,
  };
}
