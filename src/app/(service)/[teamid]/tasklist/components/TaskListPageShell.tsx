/**
 * 할 일 리스트 페이지 클라이언트 영역(사이드바 상태·모달·FAB)입니다.
 */

'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import TaskListBoard from '@/app/(service)/[teamid]/tasklist/components/TaskListBoard';
import TaskListColumnDeleteModal from '@/app/(service)/[teamid]/tasklist/components/TaskListColumnDeleteModal';
import TaskListContentArea from '@/app/(service)/[teamid]/tasklist/components/TaskListContentArea';
import TaskListCreateColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateColumnModal';
import TaskListCreateTaskModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModal';
import TaskListFAB from '@/app/(service)/[teamid]/tasklist/components/TaskListFAB';
import TaskListPageHeader from '@/app/(service)/[teamid]/tasklist/components/TaskListPageHeader';
import TaskListRenameColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListRenameColumnModal';
import TaskListSidebar from '@/app/(service)/[teamid]/tasklist/components/TaskListSidebar';
import useTaskListPageShellQuery from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListPageShellQuery';
import type { TaskListPageShellProps } from '@/app/(service)/[teamid]/tasklist/types';
import { getCurrentKoreaCalendarDate } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { ROUTES } from '@/constants/ROUTES';

export default function TaskListPageShell({
  teamId,
  taskId,
}: TaskListPageShellProps) {
  const [selectedDate, setSelectedDate] = useState(() =>
    getCurrentKoreaCalendarDate(),
  );
  const router = useRouter();

  const {
    columnPendingDelete,
    columnPendingRename,
    columnTitle,
    columns,
    effectiveActiveId,
    groupDetail,
    hasAccessibleTeamRoute,
    handleConfirmDeleteColumnWithNavigation,
    handleCreateColumn,
    handleCreateTask,
    handleConfirmTeamPageDelete,
    handleRenameColumn,
    isTeamRouteLoading,
    isCreateColumnOpen,
    isCreateTaskOpen,
    setColumnPendingDelete,
    setColumnPendingRename,
    setIsCreateColumnOpen,
    setIsCreateTaskOpen,
  } = useTaskListPageShellQuery({
    onSelectDate: setSelectedDate,
    selectedDate,
    teamId,
    taskId,
  });

  if (isTeamRouteLoading || !hasAccessibleTeamRoute) {
    return null;
  }

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
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
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
          initialSelectedDate={selectedDate}
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={handleCreateTask}
          groupId={Number(teamId)}
          taskListId={effectiveActiveId}
        />
      )}

      {columnPendingDelete && (
        <TaskListColumnDeleteModal
          onClose={() => setColumnPendingDelete(null)}
          onConfirm={handleConfirmDeleteColumnWithNavigation}
          taskListTitle={columnPendingDelete.title}
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
