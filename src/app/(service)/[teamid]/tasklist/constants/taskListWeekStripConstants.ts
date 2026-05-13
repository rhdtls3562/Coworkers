/**
 * 리스트 페이지 주간 날짜 스트립의 레이아웃 상수입니다.
 */

import { cn } from '@/utils/cn';

export const TASK_LIST_WEEK_STRIP_SCROLL_ROW_CLASS =
  'flex cursor-grab gap-1 overflow-x-auto select-none touch-pan-x sm:gap-2.5 md:gap-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing';

export const TASK_LIST_WEEK_DAY_CELL_CLASS = cn(
  'shrink-0',
  'w-[max(3.25rem,calc((100%-1.5rem)/7))]',
  'sm:w-[max(3.25rem,calc((100%-3.75rem)/7))]',
  'md:w-[max(3.25rem,calc((100%-4.5rem)/7))]',
);
