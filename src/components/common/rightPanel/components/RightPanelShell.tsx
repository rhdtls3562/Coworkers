'use client';

import RightPanelCloseButton from '@/components/common/rightPanel/components/RightPanelCloseButton';
import type { RightPanelShellProps } from '@/components/common/rightPanel/types';
import { cn } from '@/utils/cn';

/**
 * 공통 오른쪽 패널의 상단 바, 본문, 하단 액션 영역을 배치하는 셸 컴포넌트입니다.
 */
export default function RightPanelShell({
  body,
  className,
  content,
  footer,
  headerAction,
  meta,
  onClose,
  title,
}: RightPanelShellProps) {
  if (content) {
    return (
      <div
        data-right-panel-root="true"
        className={cn(
          'relative flex h-full flex-col bg-background-inverse',
          className,
        )}
      >
        <div className="sticky top-0 z-10 flex h-13 items-center  bg-background-inverse px-4 md:static md:h-auto md:border-b-0 md:bg-transparent md:px-8 md:pt-8">
          <RightPanelCloseButton onClose={onClose} />
        </div>

        <div className="min-h-0 flex-1">{content}</div>
      </div>
    );
  }

  if (!body || !title) {
    return null;
  }

  const renderedTitle =
    typeof title === 'string' ? (
      <h2 className="text-xl font-bold text-text-primary md:text-2xl">
        {title}
      </h2>
    ) : (
      title
    );

  return (
    <div
      data-right-panel-root="true"
      className={cn(
        'relative flex h-full flex-col bg-background-inverse',
        className,
      )}
    >
      <div className="sticky top-0 z-10 flex h-13 items-center border-b border-background-tertiary bg-background-inverse px-4 md:static md:h-auto md:border-b-0 md:bg-transparent md:px-8 md:pt-8">
        <RightPanelCloseButton onClose={onClose} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-36 pt-6 md:px-8 md:pb-40 md:pt-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">{renderedTitle}</div>
          {headerAction}
        </div>

        {meta && <div className="mt-5 md:mt-6">{meta}</div>}

        <div
          className={cn(
            'mt-6 border-t border-background-tertiary pt-6 md:mt-7 md:pt-7',
            !meta && 'mt-7 md:mt-8',
          )}
        >
          {body}
        </div>
      </div>

      {footer && (
        <div className="absolute inset-x-0 bottom-20 px-6 md:px-8">
          {footer}
        </div>
      )}
    </div>
  );
}
