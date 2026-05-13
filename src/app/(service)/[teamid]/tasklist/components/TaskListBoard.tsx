/**
 * 선택한 할 일 목록의 보드(제목·월 네비·주간 칩·할 일 목록)입니다.
 */

'use client';

import { useCallback } from 'react';

import TaskListBoardEmptyTaskRow from '@/app/(service)/[teamid]/tasklist/components/TaskListBoardEmptyTaskRow';
import TaskListMonthNavigator from '@/app/(service)/[teamid]/tasklist/components/TaskListMonthNavigator';
import TaskListTaskDeleteModal from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskDeleteModal';
import TaskListTaskDetailPanel from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskDetailPanel';
import TaskListTaskRow from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskRow';
import TaskListWeekStrip from '@/app/(service)/[teamid]/tasklist/components/TaskListWeekStrip';
import {
  TASK_LIST_BOARD_CARD_SHELL_CLASS,
  TASK_LIST_BOARD_COLUMN_TITLE_CLASS,
} from '@/app/(service)/[teamid]/tasklist/constants/taskListBoardConstants';
import { useTaskListBoardQuery } from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListBoardQuery';
import type {
  TaskListBoardProps,
  TaskListTaskDetailOpenMode,
} from '@/app/(service)/[teamid]/tasklist/types';
import useRightPanel from '@/components/layout/hooks/useRightPanel';
import { cn } from '@/utils/cn';

export default function TaskListBoard({
  className,
  columnTitle,
  groupId,
  onOpenCreateTask,
  onSelectDate,
  selectedDate,
  taskListId,
  teamId,
}: TaskListBoardProps) {
  const { openRightPanel } = useRightPanel();
  const {
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleRequestDelete,
    handleToggleChecked,
    isTaskListEmpty,
    sortedTasks,
    taskPendingDelete,
  } = useTaskListBoardQuery({ groupId, selectedDate, taskListId });

  const handleOpenTaskDetail = useCallback(
    (task: (typeof sortedTasks)[number], mode: TaskListTaskDetailOpenMode) => {
      openRightPanel({
        content: (
          <TaskListTaskDetailPanel
            key={`${task.id}-${mode}`}
            initialMode={mode}
            task={task}
            teamId={teamId}
          />
        ),
      });
    },
    [openRightPanel, teamId],
  );

  return (
    <section
      className={cn(TASK_LIST_BOARD_CARD_SHELL_CLASS, className)}
      aria-label={`${columnTitle} 할 일 보드`}
    >
      <header className="flex min-w-0 flex-row items-center gap-2 sm:gap-6">
        <h2 className={TASK_LIST_BOARD_COLUMN_TITLE_CLASS}>{columnTitle}</h2>
        <div className="shrink-0">
          <TaskListMonthNavigator
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />
        </div>
      </header>

      <TaskListWeekStrip
        className="mt-6 md:mt-8"
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      <ul className="mt-6 flex list-none flex-col gap-3 p-0 md:mt-8 md:gap-4">
        {isTaskListEmpty ? (
          <li className="list-none">
            <TaskListBoardEmptyTaskRow
              selectedDate={selectedDate}
              onClick={onOpenCreateTask}
            />
          </li>
        ) : (
          sortedTasks.map((task) => (
            <li key={task.id} className="list-none">
              <TaskListTaskRow
                task={task}
                onOpenDetail={handleOpenTaskDetail}
                onToggleChecked={handleToggleChecked}
                onRequestDelete={handleRequestDelete}
              />
            </li>
          ))
        )}
      </ul>

      {taskPendingDelete && (
        <TaskListTaskDeleteModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          taskTitle={taskPendingDelete.title}
        />
      )}
    </section>
  );
}
