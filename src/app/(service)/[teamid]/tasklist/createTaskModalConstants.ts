import type { TaskListSelectDropdownItem } from '@/app/(service)/[teamid]/tasklist/components/TaskListSelectDropdown';
import type { TaskListCreateTaskRepeatValue } from '@/app/(service)/[teamid]/tasklist/types';
import { cn } from '@/utils/cn';

/** 라벨·소제목 — 피그마 16 / leading 19 */
export const MODAL_HEADING_TYPO = cn(
  'm-0 block text-base font-medium text-text-primary',
);

/** 피그마 필드 래퍼: 높이 48px, 좌우 16px, rounded-xl, focus-within 브랜드 보더 */
export const CREATE_TASK_FIELD_SHELL_CLASS = cn(
  'flex h-12 items-center gap-2.5 rounded-xl border border-background-tertiary bg-background-primary',
  'outline-none transition-colors',
  'focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary/30',
);

/** 제목 input — 셸 안에서 보더 제거 */
export const CREATE_TASK_TITLE_INPUT_INNER_CLASS = cn(
  'h-auto min-h-0 flex-1 border-0 bg-transparent p-0 shadow-none ring-0 outline-none',
  'text-base font-normal leading-[19px] text-text-primary placeholder:text-text-default ',
  'focus:border-transparent focus:ring-0',
);

/** 메모 래퍼 — 피그마 총 높이 75px */
export const CREATE_TASK_MEMO_SHELL_CLASS = cn(
  'flex h-[75px] min-h-[75px] flex-col overflow-hidden rounded-xl border border-background-tertiary bg-background-primary px-4 py-3',
  'outline-none transition-colors',
  'focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary/30',
);

/** 메모 셸 안 래퍼 — 공용 ContentTextarea 수정 없이 높이 채움 */
export const CREATE_TASK_MEMO_INNER_WRAPPER_CLASS =
  'flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden';

/** tasklist 전용 메모 textarea (ContentTextarea와 분리) */
export const CREATE_TASK_MEMO_TEXTAREA_CLASS = cn(
  'box-border min-h-0 w-full min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-0 py-0 text-base leading-[19px] text-text-primary outline-none',
  'placeholder:text-text-default',
  'focus:border-transparent focus:ring-0',
  'disabled:cursor-not-allowed disabled:bg-background-secondary',
  'md:min-h-0',
);

/** 날짜·시간 트리거 — 피그마와 동일 셸 스타일(표시값은 text-default) */
export const DATE_TIME_TRIGGER_CLASS = cn(
  'flex h-12 w-full min-w-0 items-center gap-2.5 rounded-xl border border-background-tertiary bg-background-primary px-4',
  'text-left text-base font-normal leading-[19px] text-text-default',
  'outline-none transition-colors',
  'focus-visible:border-brand-primary focus-visible:ring-1 focus-visible:ring-brand-primary/30',
);

/** 날짜·시간 포커스/열림 */
export const DATE_TIME_TRIGGER_ACTIVE_CLASS =
  'border-brand-primary ring-1 ring-brand-primary/30';

/**
 * 본문 컬럼 — 모달 `max-w-sm` + `p-10` 실제 가용 폭(≈304px)에 맞춤. 고정 w-84는 가로 오버플로 유발.
 */
export const CREATE_TASK_MODAL_COLUMN_CLASS = 'w-full min-w-0 max-w-full';

/** 시간 트리거 열 — 피그마 고정 폭 124px */
export const DATE_TIME_TIME_COLUMN_CLASS = 'relative z-10 w-[124px] shrink-0';

/** 시간 선택 오버레이 — 달력과 톤을 맞춘 커스텀 선택 패널 */
export const DATE_TIME_TIME_POPOVER_CLASS =
  'absolute top-full right-0 z-30 mt-2 w-[240px] rounded-xl border border-brand-primary bg-background-primary p-4 shadow-lg';

export const DATE_TIME_TIME_POPOVER_COLUMN_CLASS =
  'flex max-h-45 flex-col gap-1 overflow-y-auto rounded-lg bg-background-secondary p-1';

export const DATE_TIME_TIME_POPOVER_OPTION_CLASS = cn(
  'flex h-9 items-center justify-center rounded-lg text-sm font-medium text-text-primary transition-colors',
  'hover:bg-brand-secondary hover:text-brand-primary',
);

export const DATE_TIME_TIME_POPOVER_OPTION_ACTIVE_CLASS =
  'bg-brand-primary text-text-inverse hover:bg-brand-primary hover:text-text-inverse';

/** 반복 드롭다운 트리거 — '반복 안함' 한 줄 표시(110px → 124px) */
export const REPEAT_TRIGGER_LAYOUT_CLASS =
  'block w-[124px] max-w-full shrink-0';

/** 반복 트리거 — 피그마 select 14 / leading 17, 패딩 px-3.5 py-2.5 */
export const REPEAT_DROPDOWN_BUTTON_CLASS = cn(
  'border-background-tertiary text-sm font-medium leading-[17px] text-text-default',
  'rounded-xl px-3.5 py-2.5',
);

export const TASK_LIST_CREATE_TASK_REPEAT_ITEMS: TaskListSelectDropdownItem<TaskListCreateTaskRepeatValue>[] =
  [
    { value: 'once', label: '반복 안함' },
    { value: 'daily', label: '매일' },
    { value: 'monthly', label: '매월' },
    { value: 'weekly', label: '주 반복' },
  ];
