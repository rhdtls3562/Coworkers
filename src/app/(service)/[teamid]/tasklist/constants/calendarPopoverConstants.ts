/**
 * TaskListCalendarPopover — 레이아웃·DatePicker 래퍼 클래스.
 * 피그마 치수(258px, 300px, 336px)는 여기서만 참조합니다.
 */

import { cn } from '@/utils/cn';

/** 월 네비 옆 앵커 — 버튼 아래 고정 */
export const TASK_LIST_CALENDAR_ANCHORED_WRAPPER_CLASS =
  'absolute top-12 right-0 z-20';

/** 보드 등 플로우에 펼쳐 높이 증가 */
export const TASK_LIST_CALENDAR_INLINE_EXPAND_WRAPPER_CLASS = cn(
  'mx-auto flex w-fit max-w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-primary bg-background-primary py-4 shadow-lg',
);

/** 할 일 만들기 모달 — 버튼 행 아래 오버레이 */
export const TASK_LIST_CALENDAR_MODAL_OVERLAY_WRAPPER_CLASS = cn(
  'absolute left-0 right-0 top-full z-40 mt-2 flex w-full justify-center rounded-xl border border-brand-primary bg-background-primary shadow-lg',
);

/** DatePicker 인라인 확장 시 내부 달력 폭·정렬(300px / md 336px) */
export const TASK_LIST_EXPAND_DATE_PICKER_CLASS = cn(
  '!m-0 flex shrink-0 justify-center',
  'w-full max-w-[280px] md:max-w-[336px]',
  '[&_.coworkers-date-picker]:!mx-auto [&_.coworkers-date-picker]:!flex [&_.coworkers-date-picker]:!w-full [&_.coworkers-date-picker]:!max-w-[280px] md:[&_.coworkers-date-picker]:!max-w-[336px]',
  '[&_.coworkers-date-picker]:!justify-center',
  '[&_.react-datepicker]:!mx-auto [&_.react-datepicker]:!border-0 [&_.react-datepicker]:!shadow-none',
  '[&_.react-datepicker]:!h-full [&_.react-datepicker]:!min-h-0 [&_.react-datepicker]:!w-[280px] md:[&_.react-datepicker]:!w-[336px]',
  '[&_.react-datepicker__month-container]:!mx-auto',
);
