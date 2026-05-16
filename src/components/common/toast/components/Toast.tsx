/**
 * 토스트 알림을 렌더링하는 컴포넌트입니다.
 * success(파란색), error(빨간색) 두 가지 타입을 지원합니다.
 * 모바일에서는 아이콘이 표시되지 않습니다.
 */

'use client';

import { IcAlertCircleWhiteLarge, IcCloseMedium } from '@/assets';
import type { ToastItem } from '@/components/common/toast/types';
import { cn } from '@/utils/cn';

type ToastProps = {
  toast: ToastItem;
  onRemove: (id: string) => void;
};

export default function Toast({ toast, onRemove }: ToastProps) {
  const isSuccess = toast.type === 'success';
  const shouldShowCloseButton = !toast.hideCloseButton;

  const handleAction = () => {
    onRemove(toast.id);
    toast.onAction?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex h-12.25 w-85.75 items-center justify-between rounded-xl px-4 md:h-14.25 md:w-125 md:px-5 lg:h-12 lg:w-217',
        isSuccess ? 'bg-brand-primary' : 'bg-status-danger',
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="hidden md:block">
          <IcAlertCircleWhiteLarge width={24} height={24} aria-hidden="true" />
        </span>
        <p className="truncate text-sm font-medium text-text-inverse md:text-base">
          {toast.message}
        </p>
      </div>
      <div className="ml-4 flex shrink-0 items-center gap-2">
        {toast.actionLabel && (
          <button
            data-toast-action="true"
            type="button"
            onClick={handleAction}
            className={cn(
              'h-8.25 rounded-lg bg-background-primary px-3 text-sm font-medium hover:bg-background-secondary',
              toast.actionTextClassName ?? 'text-brand-primary',
            )}
          >
            {toast.actionLabel}
          </button>
        )}

        {shouldShowCloseButton && (
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            aria-label="토스트 닫기"
            className="flex size-8 items-center justify-center"
          >
            <IcCloseMedium
              width={20}
              height={20}
              className="size-5 [&_path]:stroke-text-inverse"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
}
