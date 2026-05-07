'use client';

import { IcCheckInverse } from '@/assets';
import type { TaskDetailPanelFooterProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelFooter({
  completionActionLabel = '완료하기',
  isEditing,
  onSubmitEdit,
}: TaskDetailPanelFooterProps) {
  return (
    <div className="flex justify-end">
      {isEditing ? (
        <button
          data-allow-unsaved="true"
          type="button"
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand-primary px-5 text-sm font-semibold text-text-inverse md:h-12 md:px-6 md:text-base"
          onClick={onSubmitEdit}
        >
          <IcCheckInverse
            width={16}
            height={16}
            className="size-4"
            aria-hidden="true"
          />
          수정하기
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand-primary px-5 text-sm font-semibold text-text-inverse md:h-12 md:px-6 md:text-base"
        >
          <IcCheckInverse
            width={16}
            height={16}
            className="size-4"
            aria-hidden="true"
          />
          {completionActionLabel}
        </button>
      )}
    </div>
  );
}
