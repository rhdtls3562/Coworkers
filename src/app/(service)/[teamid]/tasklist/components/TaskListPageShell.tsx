/**
 * 할 일 리스트 페이지 클라이언트 영역(사이드바 상태·모달·FAB)입니다.
 */

'use client';

import { useMemo, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { teamQueryOptions, userQueryOptions } from '@/api/queryOptions';
import { createTaskList, deleteTaskList, updateTaskList } from '@/api/taskApi';
import TaskListBoard from '@/app/(service)/[teamid]/tasklist/components/TaskListBoard';
import TaskListColumnDeleteModal from '@/app/(service)/[teamid]/tasklist/components/TaskListColumnDeleteModal';
import TaskListContentArea from '@/app/(service)/[teamid]/tasklist/components/TaskListContentArea';
import TaskListCreateColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateColumnModal';
import TaskListCreateTaskModal from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModal';
import TaskListFAB from '@/app/(service)/[teamid]/tasklist/components/TaskListFAB';
import TaskListPageHeader from '@/app/(service)/[teamid]/tasklist/components/TaskListPageHeader';
import TaskListRenameColumnModal from '@/app/(service)/[teamid]/tasklist/components/TaskListRenameColumnModal';
import TaskListSidebar from '@/app/(service)/[teamid]/tasklist/components/TaskListSidebar';
import type { TaskListColumnItem } from '@/app/(service)/[teamid]/tasklist/types';
import { useToast } from '@/components/common/toast';

type TaskListPageShellProps = {
  teamId: string;
};

export default function TaskListPageShell({ teamId }: TaskListPageShellProps) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 1. 내 그룹 목록 조회
  const { data: groups } = useQuery({
    ...userQueryOptions.groups(),
  });

  // 첫 번째 그룹 자동 선택
  const groupId = groups?.[0]?.id ?? null;

  // 2. 선택된 그룹 상세 조회 → taskLists 가져오기
  const { data: groupDetail } = useQuery({
    ...teamQueryOptions.detail(String(groupId)),
    enabled: groupId !== null,
  });

  // 3. taskLists를 사이드바 columns 형태로 변환
  const columns: TaskListColumnItem[] = useMemo(() => {
    if (!groupDetail?.taskLists) return [];
    return groupDetail.taskLists.map((tl) => ({
      id: String(tl.id),
      title: tl.name,
      completed: tl.tasks.filter((t) => t.doneAt !== null).length,
      total: tl.tasks.length,
    }));
  }, [groupDetail]);

  const [activeId, setActiveId] = useState<string>('');

  // 첫 번째 taskList 자동 선택
  const effectiveActiveId = activeId || columns[0]?.id || '';

  const [columnPendingDelete, setColumnPendingDelete] =
    useState<TaskListColumnItem | null>(null);
  const [columnPendingRename, setColumnPendingRename] =
    useState<TaskListColumnItem | null>(null);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const columnTitle = useMemo(() => {
    const found = columns.find((c) => c.id === effectiveActiveId);
    return found?.title ?? '할 일';
  }, [columns, effectiveActiveId]);

  const handleRequestDeleteColumn = (item: TaskListColumnItem) => {
    setColumnPendingDelete(item);
  };

  const handleRequestRenameColumn = (item: TaskListColumnItem) => {
    setColumnPendingRename(item);
  };

  const handleCloseColumnDeleteModal = () => {
    setColumnPendingDelete(null);
  };

  const handleConfirmDeleteColumn = async () => {
    if (!columnPendingDelete || !groupId) return;

    try {
      await deleteTaskList(String(groupId), columnPendingDelete.id);
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
      setColumnPendingDelete(null);
      showToast('삭제되었습니다.', 'error');
    } catch {
      // TODO: 에러 처리
    }
  };

  const handleCreateColumn = async (name: string) => {
    if (!groupId) return;

    try {
      await createTaskList(String(groupId), { name });
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsCreateColumnOpen(false);
      showToast('할일 목록이 생성되었습니다.', 'success');
    } catch {
      // TODO: 에러 처리
    }
  };

  const handleCreateTask = async () => {
    await queryClient.invalidateQueries({ queryKey: ['teams'] });
    setIsCreateTaskOpen(false);
    showToast('할일이 생성되었습니다.', 'success');
  };

  const handleCloseRenameColumnModal = () => {
    setColumnPendingRename(null);
  };

  const handleRenameColumn = async (name: string) => {
    if (!columnPendingRename || !groupId) return;

    try {
      await updateTaskList(String(groupId), columnPendingRename.id, { name });
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
      setColumnPendingRename(null);
      showToast('변경되었습니다.', 'success');
    } catch {
      // TODO: 에러 처리
    }
  };

  return (
    <>
      <TaskListContentArea className="gap-0 lg:grid lg:grid-cols-[16.875rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-6">
        <div className="-mx-4 bg-background-secondary px-4 pb-8 pt-7.5 sm:-mx-5 sm:px-5 md:-mx-10 md:px-10 lg:contents">
          <TaskListPageHeader
            teamId={teamId}
            teamName={groupDetail?.name ?? teamId}
            className="lg:col-span-2"
            onConfirmTeamPageDelete={() => {
              showToast('삭제되었습니다.', 'error');
            }}
          />
          <TaskListSidebar
            className="mt-7.5 lg:col-start-1 lg:row-start-2 lg:mt-0"
            columns={columns}
            activeId={effectiveActiveId}
            onSelectColumn={setActiveId}
            onRequestRenameColumn={handleRequestRenameColumn}
            onRequestDeleteColumn={handleRequestDeleteColumn}
            onAddListClick={() => setIsCreateColumnOpen(true)}
          />
        </div>
        <TaskListBoard
          className="lg:col-start-2 lg:row-start-2"
          columnTitle={columnTitle}
          groupId={groupId}
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

      {isCreateTaskOpen && groupId && (
        <TaskListCreateTaskModal
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={handleCreateTask}
          groupId={groupId}
          taskListId={effectiveActiveId}
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
