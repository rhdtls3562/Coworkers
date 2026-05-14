'use client';

import RightPanelShell from '@/components/common/rightPanel/components/RightPanelShell';
import type { RightPanelProps } from '@/components/common/rightPanel/types';
import { cn } from '@/utils/cn';

export default function RightPanel({
  ariaLabel = '오른쪽 상세 패널',
  body,
  content,
  footer,
  headerAction,
  isRendered,
  isVisible,
  meta,
  onClose,
  title,
}: RightPanelProps) {
  if (!isRendered) {
    return null;
  }

  const shell = (
    <RightPanelShell
      body={body}
      footer={footer}
      headerAction={headerAction}
      meta={meta}
      onClose={onClose}
      content={content}
      title={title}
    />
  );

  return (
    <>
      <aside
        aria-label={ariaLabel}
        className={cn(
          'hidden fixed right-0 top-0 z-50 h-dvh w-195 border-l border-background-tertiary bg-background-inverse shadow-[-16px_0_32px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out will-change-transform transform-gpu 2xl:block',
          isVisible ? 'translate-x-0' : 'translate-x-full pointer-events-none',
        )}
      >
        {shell}
      </aside>

      <aside
        aria-label={ariaLabel}
        aria-modal="true"
        className={cn(
          'fixed right-0 z-50 h-dvh w-full bg-background-inverse shadow-[-16px_0_32px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out will-change-transform transform-gpu 2xl:hidden',
          'top-13 h-[calc(100dvh-3.25rem)] md:top-0 md:h-dvh md:w-130 md:border-l md:border-background-tertiary',
          isVisible ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        )}
        role="dialog"
      >
        {shell}
      </aside>
    </>
  );
}
