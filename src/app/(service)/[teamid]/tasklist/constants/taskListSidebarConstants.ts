/**
 * 리스트 페이지 사이드바의 버튼·레이아웃 클래스 상수입니다.
 */

import { cn } from '@/utils/cn';

export const TASK_LIST_ADD_LIST_BUTTON_CORE_CLASS = cn(
  'rounded-[40px] border border-solid border-brand-primary bg-background-inverse',
  'text-sm font-medium leading-4.25 text-brand-primary transition-colors hover:bg-brand-secondary',
);

export const TASK_LIST_ADD_LIST_BUTTON_MOBILE_CLASS = cn(
  'inline-flex h-10 shrink-0 flex-row items-center justify-center px-3 py-3',
  'shadow-[0_15px_50px_-12px_rgba(0,0,0,0.05)]',
  TASK_LIST_ADD_LIST_BUTTON_CORE_CLASS,
);

export const TASK_LIST_ADD_LIST_BUTTON_DESKTOP_CLASS = cn(
  'mx-auto mt-10 inline-flex h-10 w-35.75 shrink-0 items-center justify-center px-0',
  TASK_LIST_ADD_LIST_BUTTON_CORE_CLASS,
);
