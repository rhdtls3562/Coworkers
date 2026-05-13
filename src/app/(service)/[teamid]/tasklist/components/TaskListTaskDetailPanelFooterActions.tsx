/**
 * 오른쪽 패널 하단의 완료/등록 액션 버튼 영역입니다.
 */

import type { TaskListTaskDetailPanelFooterActionsProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcCheckInverse } from '@/assets';

export default function TaskListTaskDetailPanelFooterActions({
  isTaskEditing,
  onCancelTaskEdit,
  onComplete,
  onRegisterTask,
}: TaskListTaskDetailPanelFooterActionsProps) {
  return (
    <div className="absolute inset-x-0 bottom-8 px-6 md:bottom-10 md:px-8">
      <div className="flex justify-end">
        {isTaskEditing ? (
          <div className="flex items-center gap-3 text-sm font-medium text-text-default md:text-base">
            <button
              data-allow-unsaved="true"
              type="button"
              className="text-text-default"
              onClick={onCancelTaskEdit}
            >
              취소
            </button>
            <button
              data-allow-unsaved="true"
              type="button"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand-primary px-5 font-semibold text-text-inverse md:h-12 md:px-6"
              onClick={onRegisterTask}
            >
              <IcCheckInverse
                width={16}
                height={16}
                className="size-4"
                aria-hidden="true"
              />
              등록하기
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand-primary px-5 text-sm font-semibold text-text-inverse md:h-12 md:px-6 md:text-base"
            onClick={onComplete}
          >
            <IcCheckInverse
              width={16}
              height={16}
              className="size-4"
              aria-hidden="true"
            />
            완료하기
          </button>
        )}
      </div>
    </div>
  );
}
