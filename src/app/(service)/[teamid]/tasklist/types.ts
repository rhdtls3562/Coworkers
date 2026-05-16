/** 할 일 리스트 라우트에서 사용하는 타입 정의입니다. */
import type { ReactNode, RefObject } from 'react';

export type TaskListColumnItem = {
  id: string;
  title: string;
  completed: number;
  total: number;
};

export type TaskListPageParams = Promise<{ teamid: string }>;

export type TaskListItemPageParams = Promise<{
  taskid: string;
  teamid: string;
}>;

export type TaskListTaskComment = {
  id: string;
  author: string;
  authorImage: string | null;
  content: string;
  meta: string;
  createdAt: string;
};

export type TaskListBoardTask = {
  assigneeName: string;
  assigneeImage: string | null;
  id: string;
  checked: boolean;
  commentCount: number;
  comments: TaskListTaskComment[];
  description: string;
  dueDateLabel: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE';
  recurringId: string | null;
  repeatLabel: string;
  sortOrder: number;
  startDate?: string;
  startedAtRaw: string;
  startedAtLabel: string;
  taskListId: string;
  teamId: string;
  title: string;
  weekDays?: number[];
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
  groupId: string | null;
  onOpenCreateTask: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  taskListId: string;
  teamId: string;
};

export type UseTaskListBoardQueryParams = {
  groupId: string | null;
  selectedDate: Date;
  taskListId: string;
};

export type TaskListCreateTaskModalProps = {
  initialSelectedDate: Date;
  onClose: () => void;
  onSubmit?: (selectedDate: Date) => void | Promise<void>;
  groupId: number;
  taskListId: string;
};

export type TaskListCreateTaskModalTextFieldsProps = {
  formId: string;
  memo: string;
  onMemoChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  title: string;
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

export type TaskListCreateTaskRepeatValue =
  | 'once'
  | 'daily'
  | 'monthly'
  | 'weekly';

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
  timePopoverButtonRef: RefObject<HTMLButtonElement | null>;
  onStartTimeChange: (value: string) => void;
};

export type TaskListCreateTaskModalRepeatSectionProps = {
  formId: string;
  monthDay: string;
  onMonthDayBlur: () => void;
  onMonthDayChange: (value: string) => void;
  onRepeatChange: (value: TaskListCreateTaskRepeatValue) => void;
  onToggleWeekDay: (dayIndex: number) => void;
  repeat: TaskListCreateTaskRepeatValue;
  weekDays: number[];
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

export type TaskListTaskRowProps = {
  onOpenDetail: (
    task: TaskListBoardTask,
    mode: TaskListTaskDetailOpenMode,
  ) => void;
  onRequestDelete: (task: TaskListBoardTask) => void;
  onToggleChecked: (id: string, checked: boolean) => void;
  task: TaskListBoardTask;
};

export type TaskListSidebarPlusIconProps = {
  className?: string;
};

export type TaskListTaskDetailPanelProps = {
  initialMode: TaskListTaskDetailOpenMode;
  onScheduleSaved?: (date: Date) => void;
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

export type TaskListCommentAvatarProps = {
  author: string;
  authorImage: string | null;
};

export type TaskListTaskDetailPanelCloseBarProps = {
  onClose: () => void;
};

export type TaskListTaskDetailCommentActionsProps = {
  onCancel: () => void;
  onPrimaryAction: () => void;
  primaryLabel: string;
};

export type TaskListTaskDetailCommentInputProps = {
  onSubmit: (content: string) => void;
  userImage: string | null;
};

export type TaskListTaskDetailMetaProps = {
  assigneeImage: string | null;
  assigneeName: string;
  frequency: string;
  startedAtLabel: string;
  startedAtLabelText: string;
};

export type TaskListBoardEmptyTaskRowProps = {
  className?: string;
  onClick: () => void;
  selectedDate: Date;
};

export type TaskListRepeatWeekdayPickerProps = {
  className?: string;
  onToggleDay: (getDay: number) => void;
  selectedDays: number[];
};

export type TaskListTaskDetailPanelFooterActionsProps = {
  isTaskEditing: boolean;
  onCancelTaskEdit: () => void;
  onComplete: () => void;
  onRegisterTask: () => void;
};

export type TaskListTaskDetailPanelContentProps = {
  comments: TaskListTaskComment[];
  currentUserImage: string | null;
  currentUserName: string;
  description: string;
  draftCommentContent: string;
  draftDescription: string;
  draftTitle: string;
  editingCommentId: string | null;
  isTaskEditing: boolean;
  onCancelCommentEdit: () => void;
  onChangeDraftContent: (value: string) => void;
  onCreateComment: (content: string) => void;
  onDeleteComment: (id: string) => void;
  onDeleteFromPanel: () => void;
  onStartCommentEdit: (comment: TaskListTaskComment) => void;
  onStartTaskEdit: () => void;
  onSubmitCommentEdit: () => void;
  setDraftDescription: (value: string) => void;
  setDraftTitle: (value: string) => void;
  task: TaskListBoardTask;
  title: string;
};

export type TaskListTaskDeleteModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  taskTitle?: string;
};

export type TaskListCreateColumnModalProps = {
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
};

export type TaskListRenameColumnModalProps = {
  initialName: string;
  onClose: () => void;
  onSubmit: (name: string) => void | Promise<void>;
};

export type TaskListColumnDeleteModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  taskListTitle?: string;
};

export type TaskListTeamPageDeleteModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  teamName?: string;
};

export type TaskListPageShellProps = {
  taskId: string;
  teamId: string;
};

export type UseTaskListPageShellQueryParams = {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  taskId: string;
  teamId: string;
};

export type TaskListPageHeaderProps = {
  className?: string;
  onConfirmTeamPageDelete?: () => void | Promise<void>;
  teamId: string;
  teamName: string;
};

export type TaskListMonthNavigatorProps = {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
};

export type TaskListWeekStripProps = {
  className?: string;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
};

export type TaskListWeekStripFadeState = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

export type UseTaskListWeekStripFadeReturn = {
  fadeState: TaskListWeekStripFadeState;
};

export type TaskListFABProps = {
  className?: string;
  onClick: () => void;
};

export type TaskListEmptyColumnPlaceholderProps = {
  className?: string;
};

export type TaskListColumnDropdownProps = {
  activeId: string;
  className?: string;
  items: TaskListColumnItem[];
  onSelect: (id: string) => void;
};

export type TaskListNavItemProps = {
  isActive: boolean;
  item: TaskListColumnItem;
  onRequestDelete: (item: TaskListColumnItem) => void;
  onRequestRename: (item: TaskListColumnItem) => void;
  onSelect: () => void;
};

export type TaskListTaskRowOptionsMenuItem = {
  label: string;
  onClick: () => void;
};

export type TaskListTaskRowOptionsMenuProps = {
  className?: string;
  items: TaskListTaskRowOptionsMenuItem[];
  trigger: ReactNode;
};

export type TaskListTimePopoverProps = {
  formId: string;
  onSelectTime: (value: string) => void;
  selectedTime: string;
};

export type TaskListSelectDropdownItem<T extends string> = {
  label: string;
  value: T;
};

export type TaskListSelectDropdownVariant = 'overlay' | 'inlineExpand';

export type TaskListSelectDropdownProps<T extends string> = {
  buttonClassName?: string;
  className?: string;
  /** true이면 항목 선택 시에만 닫히고 바깥 클릭으로는 닫히지 않습니다. */
  closeOnSelectOnly?: boolean;
  items: TaskListSelectDropdownItem<T>[];
  menuClassName?: string;
  onChange: (value: T) => void;
  placeholder?: string;
  value: T;
  variant?: TaskListSelectDropdownVariant;
};

export type UseTaskListCreateTaskMutationParams = {
  groupId: number;
  memo: string;
  monthDay: number;
  onClose: () => void;
  onSubmit?: (selectedDate: Date) => void | Promise<void>;
  repeat: TaskListCreateTaskRepeatValue;
  selectedDate: Date;
  startTime: string;
  taskListId: string;
  title: string;
  weekDays: number[];
};

export type UseTaskListRecurringWeekDaysQueryParams = {
  groupId: string | null;
  selectedDate: Date;
  taskListDetail?: import('@/types/task').TaskListDetail;
  taskListId: string;
};

export type UseTaskListSidebarColumnsQueryParams = {
  selectedDate: Date;
  taskLists: readonly import('@/types/task').TaskListSummary[];
  teamId: string;
};

export type UseTaskListTaskDetailPanelParams = {
  currentUserName: string;
  initialMode: TaskListTaskDetailOpenMode;
  task: TaskListBoardTask;
};
