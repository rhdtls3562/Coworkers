/**
 * 마이 히스토리 페이지 전역에서 사용하는 타입을 정의하는 파일입니다.
 */

import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from 'react';

import { MY_HISTORY_DATE_RANGE_MODES } from '@/app/(service)/myhistory/constants';
import type { DatePickerRangeValue } from '@/components/common/form/types';
import type { TaskDetailScheduleEditConfig } from '@/components/common/rightPanel/types';

export type MyHistoryFilter = {
  count: number;
  id: string;
  label: string;
};

export type MyHistoryFilterId = 'once' | 'recurring';

export type MyHistoryViewMode = 'completed' | 'pending';

export type MyHistoryDateSelectionMode =
  (typeof MY_HISTORY_DATE_RANGE_MODES)[keyof typeof MY_HISTORY_DATE_RANGE_MODES];

export type MyHistoryResolvedDateRange = {
  endDate: Date;
  startDate: Date;
};

export type MyHistoryDateRange = MyHistoryResolvedDateRange & {
  mode: MyHistoryDateSelectionMode;
};

export type MyHistoryDraftDateRange = {
  endDate: Date | null;
  startDate: Date | null;
};

export type MyHistorySummaryDetail = {
  doneCount: number;
  countText: string;
  id: string;
  totalCount: number;
  title: string;
};

export type MyHistorySummaryItem = {
  count: number;
  countText: string;
  details: MyHistorySummaryDetail[];
  id: string;
  title: string;
};

export type HistoryTaskFrequency = string | undefined;

export type MyHistoryTask = {
  commentCount: number;
  description: string;
  doneAt: string;
  dueDate: string;
  frequency: string;
  id: string;
  isCompleted: boolean;
  scheduleEditConfig?: TaskDetailScheduleEditConfig;
  startedAt: string;
  taskListId: string;
  teamId: string;
  title: string;
};

export type MyHistoryCompletedTaskRecord = {
  date?: string;
  description?: string | null;
  displayIndex?: number;
  doneAt?: string;
  frequency?: string;
  id?: string;
  name?: string;
};

export type MyHistoryTaskGroup = {
  id: string;
  tasks: MyHistoryTask[];
  teamName: string;
  title: string;
};

export type MyHistoryDateSection = {
  date: string;
  groups: MyHistoryTaskGroup[];
  id: string;
};

export type MyHistoryDisplayDateSection = Omit<MyHistoryDateSection, 'date'> & {
  dateLabel: string;
};

export type HistoryMembershipTeam = {
  createdAt?: string;
  id: string;
  name: string;
};

export type HistoryTaskListSummary = {
  displayIndex: number;
  id: string;
  name: string;
  tasks: HistoryTaskListSummaryTask[];
};

export type HistoryTaskListSummaryTask = {
  commentCount: number;
  date: string;
  description: string;
  displayIndex: number;
  doneAt?: string;
  frequency?: string;
  id: string;
  name: string;
  recurringId?: number;
  weekDays?: number[];
};

export type HistoryTeamDetail = {
  id: string;
  name: string;
  taskLists: HistoryTaskListSummary[];
};

export type HistoryTaskListTask = {
  commentCount: number;
  date: string;
  description: string;
  displayIndex: number;
  doneAt?: string;
  doneByUserId?: number | string;
  frequency?: string;
  id: string;
  name: string;
  recurringId?: number;
  weekDays?: number[];
};

export type HistoryTaskListDetailSource = {
  dateKey: string;
  displayIndex: number;
  taskListId: string;
  taskListName: string;
  tasks: HistoryTaskListTask[];
  teamId: string;
  teamName: string;
};

export type HistoryTaskMeta = {
  commentCount: number;
  scheduleEditConfig?: TaskDetailScheduleEditConfig;
  taskDisplayIndex: number;
  taskIdentityKey: string;
  taskListDisplayIndex: number;
  taskListId: string;
  taskListName: string;
  taskName: string;
  teamId: string;
  teamName: string;
};

export type HistorySummaryAccumulator = {
  details: Map<
    string,
    {
      displayIndex: number;
      doneCount: number;
      name: string;
      totalCount: number;
    }
  >;
  doneCount: number;
  name: string;
};

export type HistoryTaskListDescriptor = {
  dateKey: string;
  displayIndex: number;
  taskListId: string;
  taskListName: string;
  teamId: string;
  teamName: string;
};

export type UseHistoryBoardDataParams = {
  activeFilterId: string | null;
  completedTasks: readonly MyHistoryCompletedTaskRecord[];
  isAllRange: boolean;
  selectedRange: MyHistoryDateRange;
  shouldLimitTeamQueries: boolean;
  viewMode: MyHistoryViewMode;
};

export type UseHistorySelectedRangeParams = {
  defaultAnchorDate: Date;
};

export type UseHistoryTaskListSourcesQueryParams = {
  activeFilterId: string | null;
  shouldLimitTeamQueries: boolean;
  teamDetails: readonly HistoryTeamDetail[];
  visibleDateKeys: readonly string[];
};

export type UseDragScrollReturn = {
  containerRef: RefObject<HTMLUListElement | null>;
  handleClickCapture: (event: ReactMouseEvent<HTMLElement>) => void;
  handlePointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  handlePointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
};

export type HistoryMonthNavigatorProps = {
  onApplyRange: (range: MyHistoryResolvedDateRange) => void;
  onMoveMonth: (monthOffset: number) => void;
  selectedRange: MyHistoryDateRange;
  title: string;
};

export type UseHistoryMonthNavigatorParams = {
  closeCalendar: () => void;
  isCalendarOpen: boolean;
  onApplyRange: (range: MyHistoryResolvedDateRange) => void;
  onMoveMonth: (monthOffset: number) => void;
  selectedRange: MyHistoryDateRange;
  toggleCalendar: () => void;
};

export type HistoryBoardProps = {
  activeFilterId: string | null;
  datedHistorySections: readonly MyHistoryDisplayDateSection[];
  emptyDescription: string;
  emptyTitle: string;
  filters: readonly MyHistoryFilter[];
  hasTasks: boolean;
  isError: boolean;
  isLoading: boolean;
  isProgressivelyLoading: boolean;
  onApplyRange: (range: MyHistoryResolvedDateRange) => void;
  onMoveMonth: (monthOffset: number) => void;
  onSelectFilter: (filterId: string) => void;
  selectedRange: MyHistoryDateRange;
  title: string;
};

export type HistoryCalendarPopoverProps = {
  calendarRef: RefObject<HTMLDivElement | null>;
  endDate: Date | null;
  maxDate?: Date;
  minDate?: Date;
  onSelectRange: (range: DatePickerRangeValue) => void;
  openToDate: Date;
  startDate: Date | null;
};

export type HistoryDateSectionProps = {
  section: MyHistoryDisplayDateSection;
};

export type HistoryFilterTabsProps = {
  activeFilterId: string | null;
  filters: readonly MyHistoryFilter[];
  onSelectFilter: (filterId: string) => void;
};

export type HistoryTaskCardProps = {
  task: MyHistoryTask;
};

export type HistoryTaskGroupProps = {
  group: MyHistoryTaskGroup;
};

export type MyHistorySummaryProps = {
  activeItemId: string | null;
  items: readonly MyHistorySummaryItem[];
  onSelectItem: (itemId: string) => void;
  title: string;
};

export type UseHistoryTaskCardParams = {
  task: MyHistoryTask;
};

export type HistorySectionWithParsedDate = MyHistoryDisplayDateSection & {
  parsedDate: Date;
};

export type HistoryTaskMetaMap = ReadonlyMap<string, HistoryTaskMeta>;

export type HistoryTaskListSummaryBase = {
  displayIndex: number;
  id: string;
  name: string;
};

export type HistoryTaskIdentityLike = {
  doneAt?: string;
  id: string;
  recurringId?: number;
};

export type PendingTaskSource = {
  source: HistoryTaskListDetailSource;
  task: HistoryTaskListDetailSource['tasks'][number];
};
