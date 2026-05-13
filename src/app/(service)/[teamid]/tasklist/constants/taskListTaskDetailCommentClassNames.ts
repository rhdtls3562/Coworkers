/**
 * 오른쪽 패널 댓글 영역에서 재사용하는 클래스 상수입니다.
 */

import { cn } from '@/utils/cn';

export const COMMENT_ROW_BLEED_X = '-mx-6 px-6 md:-mx-8 md:px-8';

export const COMMENT_FORM_TEXTAREA_CLASS_NAME =
  'min-h-20 resize-none rounded-xl border border-background-tertiary bg-background-primary px-4 py-3 text-sm font-medium leading-5 text-text-primary outline-none placeholder:text-text-default focus:border-brand-primary md:min-h-24 md:text-base';

export const COMMENT_BODY_ACTIONS_ROW_CLASS_NAME =
  'flex min-w-0 flex-col items-stretch gap-3 md:gap-4 lg:flex-row lg:items-end';

export const COMMENT_ACTIONS_SLOT_CLASS_NAME =
  'flex w-full shrink-0 justify-end pt-1 lg:w-auto lg:shrink-0 lg:pt-0';

export const COMMENT_BODY_LEFT_SLOT_CLASS_NAME =
  'flex min-w-0 w-full max-w-full flex-col gap-2 lg:w-auto lg:flex-1 lg:min-w-0';

export function commentItemRootClassName(isOwnComment: boolean): string {
  return cn('py-4', isOwnComment && ['bg-icon-inverse', COMMENT_ROW_BLEED_X]);
}
