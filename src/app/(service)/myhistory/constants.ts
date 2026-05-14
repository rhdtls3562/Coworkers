/**
 * 마이 히스토리 전역에서 공유하는 상수 모음입니다.
 */

export const MY_HISTORY_PAGE_TITLE = '내 히스토리';

export const MY_HISTORY_DATE_RANGE_MODES = {
  ALL: 'all',
  MONTH: 'month',
  RANGE: 'range',
} as const;

export const MY_HISTORY_VIEW_MODES = {
  COMPLETED: 'completed',
  PENDING: 'pending',
} as const;

export const MY_HISTORY_VIEW_SETTINGS = [
  {
    label: '내가 한 일',
    value: MY_HISTORY_VIEW_MODES.COMPLETED,
  },
  {
    label: '앞으로 할 일',
    value: MY_HISTORY_VIEW_MODES.PENDING,
  },
] as const;

export const MY_HISTORY_SUMMARY_TITLES = {
  [MY_HISTORY_VIEW_MODES.COMPLETED]: '내가 한 일',
  [MY_HISTORY_VIEW_MODES.PENDING]: '앞으로 할 일',
} as const;

export const MY_HISTORY_EMPTY_STATE_BY_VIEW_MODE = {
  [MY_HISTORY_VIEW_MODES.COMPLETED]: {
    description: '하나씩 완료해가며 히스토리를 만들어보세요!',
    title: '아직 완료된 작업이 없어요.',
  },
  [MY_HISTORY_VIEW_MODES.PENDING]: {
    description: '일정을 확인하고 하나씩 완료해보세요!',
    title: '아직 해야 할 작업이 없어요.',
  },
} as const;

export const MY_HISTORY_BOARD_STATUS_TEXT = {
  errorDescription: '잠시 후 다시 시도해주세요.',
  errorTitle: '내 히스토리를 불러오지 못했어요.',
  loading: '내 히스토리를 불러오는 중이에요.',
  progressiveLoading: '이전 히스토리를 더 불러오는 중이에요.',
} as const;

export const HISTORY_MONTH_NAVIGATOR_ARIA_LABELS = {
  nextMonth: '다음 달 보기',
  previousMonth: '이전 달 보기',
  selectDate: '날짜 선택',
} as const;

export const HISTORY_TASK_CARD_TEXT = {
  delete: '삭제하기',
  deleteError: '할 일 삭제에 실패했습니다.',
  deleteSuccess: '삭제되었습니다.',
  edit: '상세보기',
} as const;

export const MY_HISTORY_API_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export const HISTORY_FILTER_TABS_DRAG_THRESHOLD = 8;

export const HISTORY_PROGRESSIVE_DATE_KEY_SETTINGS = {
  initialVisibleDateCount: 2,
  visibleDateChunkSize: 2,
  visibleDateExpandDelay: 120,
} as const;
