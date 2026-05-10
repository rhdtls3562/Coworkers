/**
 * 할 일 리스트 페이지 클라이언트 영역(사이드바 상태·모달·FAB)입니다.
 */

'use client';

import { useMemo, useState } from 'react';

import TaskListBoard from '@/app/(service)/[teamid]/tasklist/components/TaskListBoard';
import TaskListColumnDeleteModal from '@/app/(service)/[teamid]/tasklist/components/TaskListColumnDeleteModal';
import TaskListContentArea from '@/app/(service)/[teamid]/tasklist/components/TaskListContentArea';
import TaskListCreateColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateColumnModal';
import TaskListCreateTaskModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModal';
import TaskListFAB from '@/app/(service)/[teamid]/tasklist/components/TaskListFAB';
import TaskListPageHeader from '@/app/(service)/[teamid]/tasklist/components/TaskListPageHeader';
import TaskListRenameColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListRenameColumnModal';
import TaskListSidebar from '@/app/(service)/[teamid]/tasklist/components/TaskListSidebar';
import { TASK_LIST_INITIAL_COLUMNS } from '@/app/(service)/[teamid]/tasklist/constants';
import type { TaskListColumnItem } from '@/app/(service)/[teamid]/tasklist/types';
import { useToast } from '@/components/common/toast';

type TaskListPageShellProps = {
  teamId: string;
};

export default function TaskListPageShell({ teamId }: TaskListPageShellProps) {
  const { showToast } = useToast();
  const [columns, setColumns] = useState<TaskListColumnItem[]>(() => [
    ...TASK_LIST_INITIAL_COLUMNS,
  ]);
  const [activeId, setActiveId] = useState<string>(
    TASK_LIST_INITIAL_COLUMNS[1]?.id ?? TASK_LIST_INITIAL_COLUMNS[0]?.id ?? '',
  );
  const [columnPendingDelete, setColumnPendingDelete] =
    useState<TaskListColumnItem | null>(null);
  const [columnPendingRename, setColumnPendingRename] =
    useState<TaskListColumnItem | null>(null);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const columnTitle = useMemo(() => {
    const found = columns.find((c) => c.id === activeId);
    return found?.title ?? '할 일';
  }, [columns, activeId]);

  const handleRequestDeleteColumn = (item: TaskListColumnItem) => {
    setColumnPendingDelete(item);
  };

  const handleRequestRenameColumn = (item: TaskListColumnItem) => {
    setColumnPendingRename(item);
  };

  const handleCloseColumnDeleteModal = () => {
    setColumnPendingDelete(null);
  };

  const handleConfirmDeleteColumn = () => {
    if (!columnPendingDelete) return;
    const removedId = columnPendingDelete.id;
    setColumnPendingDelete(null);
    const nextColumns = columns.filter((c) => c.id !== removedId);
    setColumns(nextColumns);
    if (activeId === removedId) {
      setActiveId(nextColumns[0]?.id ?? '');
    }
    showToast('삭제되었습니다.', 'error');
  };

  const handleCreateColumn = (name: string) => {
    const id = crypto.randomUUID();
    setColumns((prev) => [
      ...prev,
      { id, title: name, completed: 0, total: 0 },
    ]);
    setActiveId(id);
    setIsCreateColumnOpen(false);
    showToast('할일 목록이 생성되었습니다.', 'success');
  };

  const handleCreateTask = () => {
    setIsCreateTaskOpen(false);
    showToast('할일이 생성되었습니다.', 'success');
  };

  const handleCloseRenameColumnModal = () => {
    setColumnPendingRename(null);
  };

  const handleRenameColumn = (name: string) => {
    if (!columnPendingRename) {
      return;
    }

    const targetId = columnPendingRename.id;

    setColumns((prev) =>
      prev.map((column) =>
        column.id === targetId ? { ...column, title: name } : column,
      ),
    );
    setColumnPendingRename(null);
    showToast('변경되었습니다.', 'success');
  };

  return (
    <>
      <TaskListContentArea className="gap-0 lg:grid lg:grid-cols-[16.875rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-6">
        <div className="-mx-4 bg-background-secondary px-4 pb-8 pt-7.5 sm:-mx-5 sm:px-5 md:-mx-10 md:px-10 lg:contents">
          <TaskListPageHeader
            teamId={teamId}
            teamName={teamId}
            className="lg:col-span-2"
            onConfirmTeamPageDelete={() => {
              showToast('삭제되었습니다.', 'error');
            }}
          />
          <TaskListSidebar
            className="mt-7.5 lg:col-start-1 lg:row-start-2 lg:mt-0"
            columns={columns}
            activeId={activeId}
            onSelectColumn={setActiveId}
            onRequestRenameColumn={handleRequestRenameColumn}
            onRequestDeleteColumn={handleRequestDeleteColumn}
            onAddListClick={() => setIsCreateColumnOpen(true)}
          />
        </div>
        <TaskListBoard
          className="lg:col-start-2 lg:row-start-2"
          columnTitle={columnTitle}
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
        />
      )}

      {columnPendingDelete && (
        <TaskListColumnDeleteModal
          onClose={handleCloseColumnDeleteModal}
          onConfirm={handleConfirmDeleteColumn}
        />
      )}

      {columnPendingRename && (
        <TaskListRenameColumnModal
          initialName={columnPendingRename.title}
          onClose={handleCloseRenameColumnModal}
          onSubmit={handleRenameColumn}
        />
      )}
    </>
  );
}
