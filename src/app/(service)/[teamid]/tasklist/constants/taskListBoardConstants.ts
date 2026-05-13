/**
 * TaskListBoard 레이아웃·타이포 클래스.
 */

import { cn } from '@/utils/cn';

/** 보드 카드 — 피그마 라운드 20px */
export const TASK_LIST_BOARD_CARD_SHELL_CLASS = cn(
  'mx-[-1rem] flex w-auto min-w-0 flex-1 flex-col bg-background-inverse px-4 py-7.5 shadow-none sm:mx-0 sm:w-full sm:rounded-[20px] sm:bg-background-primary sm:px-5 sm:py-8 sm:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.05)] md:px-8 md:py-10',
);

/** 컬럼 제목 — 모바일 피그마 15px / leading 21px */
export const TASK_LIST_BOARD_COLUMN_TITLE_CLASS =
  'min-w-0 flex-1 truncate text-[15px] font-bold leading-[21px] text-text-primary sm:text-xl sm:leading-normal md:text-2xl md:leading-normal';
