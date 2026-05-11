/**
 * 할 일 리스트 페이지 클라이언트 영역(사이드바 상태·모달·FAB)입니다.
 */

'use client';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { deleteGroup } from '@/api/groupApi';
import { refetchUserQueries } from '@/api/queryRefetch';
import { getMyGroups } from '@/api/userApi';
import TaskListBoard from '@/app/(service)/[teamid]/tasklist/components/TaskListBoard';
import TaskListColumnDeleteModal from '@/app/(service)/[teamid]/tasklist/components/TaskListColumnDeleteModal';
import TaskListContentArea from '@/app/(service)/[teamid]/tasklist/components/TaskListContentArea';
import TaskListCreateColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateColumnModal';
import TaskListCreateTaskModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModal';
import TaskListFAB from '@/app/(service)/[teamid]/tasklist/components/TaskListFAB';
import TaskListPageHeader from '@/app/(service)/[teamid]/tasklist/components/TaskListPageHeader';
import TaskListRenameColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListRenameColumnModal';
import TaskListSidebar from '@/app/(service)/[teamid]/tasklist/components/TaskListSidebar';
import useTaskListPageShell from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListPageShell';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';

type TaskListPageShellProps = {
  teamId: string;
  taskId: string;
};

export default function TaskListPageShell({
  teamId,
  taskId,
}: TaskListPageShellProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const {
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
  } = useTaskListPageShell({ teamId, taskId });

  const handleConfirmDeleteColumnWithNav = async () => {
    const wasActive = columnPendingDelete?.id === taskId;
    await handleConfirmDeleteColumn();
    if (wasActive) {
      router.replace(ROUTES.TASK_LIST(teamId));
    }
  };

  const handleConfirmTeamPageDelete = async () => {
    await deleteGroup(teamId);
    await refetchUserQueries(queryClient);
    showToast('삭제되었습니다.', 'error');

    try {
      const groups = await getMyGroups();
      const firstGroupId = groups[0]?.id;
      router.push(
        firstGroupId
          ? ROUTES.TEAM(String(firstGroupId))
          : ROUTES.TEAM('nogroup'),
      );
    } catch {
      router.push(ROUTES.TEAM('nogroup'));
    }
  };

  return (
    <>
      <TaskListContentArea className="gap-0 lg:grid lg:grid-cols-[16.875rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-12">
        <div className="-mx-4 bg-background-secondary px-4 pb-8 pt-14 sm:-mx-5 sm:px-5 md:-mx-10 md:px-10 lg:contents">
          <TaskListPageHeader
            teamId={teamId}
            teamName={groupDetail?.name ?? teamId}
            className="lg:col-span-2"
            onConfirmTeamPageDelete={handleConfirmTeamPageDelete}
          />

          <TaskListSidebar
            className="mt-7.5 lg:col-start-1 lg:row-start-2 lg:mt-0"
            columns={columns}
            activeId={effectiveActiveId}
            onSelectColumn={(id) =>
              router.push(ROUTES.TASK_LIST_ITEM(teamId, id))
            }
            onRequestRenameColumn={setColumnPendingRename}
            onRequestDeleteColumn={setColumnPendingDelete}
            onAddListClick={() => setIsCreateColumnOpen(true)}
          />
        </div>

        <TaskListBoard
          className="lg:col-start-2 lg:row-start-2"
          columnTitle={columnTitle}
          groupId={teamId}
          taskListId={effectiveActiveId}
          teamId={teamId}
        />
      </TaskListContentArea>

      <TaskListFAB onClick={() => setIsCreateTaskOpen(true)} />

      {isCreateColumnOpen && (
        <TaskListCreateColumnModal
          onClose={() => setIsCreateColumnOpen(false)}
          onSubmit={handleCreateColumn}
        />
      )}

      {isCreateTaskOpen && (
        <TaskListCreateTaskModal
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={handleCreateTask}
          groupId={Number(teamId)}
          taskListId={effectiveActiveId}
        />
      )}

      {columnPendingDelete && (
        <TaskListColumnDeleteModal
          onClose={() => setColumnPendingDelete(null)}
          onConfirm={handleConfirmDeleteColumnWithNav}
        />
      )}

      {columnPendingRename && (
        <TaskListRenameColumnModal
          initialName={columnPendingRename.title}
          onClose={() => setColumnPendingRename(null)}
          onSubmit={handleRenameColumn}
        />
      )}
    </>
  );
}
