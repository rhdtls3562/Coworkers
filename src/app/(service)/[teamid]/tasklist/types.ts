/** 할 일 리스트 라우트에서 사용하는 타입 정의입니다. */

import type { ReactNode, RefObject } from 'react';

export type TaskListColumnItem = {
  id: string;
  title: string;
  completed: number;
  total: number;
};

export type TaskListTaskComment = {
  id: string;
  author: string;
  content: string;
  meta: string;
};

export type TaskListBoardTask = {
  assigneeName: string;
  id: string;
  checked: boolean;
  commentCount: number;
  comments: TaskListTaskComment[];
  description: string;
  dueDateLabel: string;
  repeatLabel: string;
  sortOrder: number;
  startedAtLabel: string;
  taskListId: string;
  teamId: string;
  title: string;
};

export type TaskListTaskDetailApplyPatch = {
  description: string;
  title: string;
};

export type TaskListTaskDetailOpenMode = 'view' | 'edit';

export type TaskListOpenTaskDetail = {
  mode: TaskListTaskDetailOpenMode;
  task: TaskListBoardTask;
};

export type TaskListBoardProps = {
  className?: string;
  columnTitle: string;
  teamId: string;
};

export type TaskListCreateTaskModalProps = {
  onClose: () => void;
  onSubmit?: () => void;
};

export type TaskListCalendarVariant =
  | 'anchored'
  | 'inlineExpand'
  | 'modalOverlay';

export type TaskListCalendarPopoverProps = {
  calendarRef: RefObject<HTMLDivElement | null>;
  onSelectDate: (date: Date | null) => void;
  selectedDate: Date;
  variant?: TaskListCalendarVariant;
};

export type TaskListContentAreaProps = {
  children: ReactNode;
  className?: string;
};

export type TaskListCreateTaskModalDateTimeSectionProps = {
  calendarButtonRef: RefObject<HTMLDivElement | null>;
  calendarRef: RefObject<HTMLDivElement | null>;
  formId: string;
  isCalendarOpen: boolean;
  isTimePopoverOpen: boolean;
  onDateChange: (date: Date | null) => void;
  onOpenDateCalendar: () => void;
  onOpenTime: () => void;
  selectedDate: Date;
  startTime: string;
  timePopoverContainerRef: RefObject<HTMLDivElement | null>;
  onStartTimeChange: (value: string) => void;
};

export type TaskListSidebarProps = {
  activeId: string;
  className?: string;
  columns: TaskListColumnItem[];
  onAddListClick: () => void;
  onRequestDeleteColumn: (item: TaskListColumnItem) => void;
  onRequestRenameColumn: (item: TaskListColumnItem) => void;
  onSelectColumn: (id: string) => void;
};

export type TaskListTaskDetailPanelProps = {
  initialMode: TaskListTaskDetailOpenMode;
  onDeleteTask: (taskId: string) => void;
  onSyncTaskChecked: (taskId: string, checked: boolean) => void;
  onSyncTaskDetail: (
    taskId: string,
    patch: TaskListTaskDetailApplyPatch,
  ) => void;
  task: TaskListBoardTask;
  teamId: string;
};

export type TaskListTaskDetailCommentItemProps = {
  comment: TaskListTaskComment;
  currentUserName: string;
  draftContent: string;
  isEditing: boolean;
  onCancelEdit: () => void;
  onChangeDraftContent: (value: string) => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onSubmitEdit: () => void;
};

/** 할 일 만들기 모달 — 반복 설정 값 */
export type TaskListCreateTaskRepeatValue =
  | 'once'
  | 'daily'
  | 'monthly'
  | 'weekly';
