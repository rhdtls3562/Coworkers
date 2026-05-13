/**
 * 오른쪽 패널 상단 닫기 바입니다.
 */

import type { TaskListTaskDetailPanelCloseBarProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcCloseSmall } from '@/assets';

export default function TaskListTaskDetailPanelCloseBar({
  onClose,
}: TaskListTaskDetailPanelCloseBarProps) {
  return (
    <div className="flex shrink-0 items-center px-6 pt-6 md:px-8 md:pt-8">
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-lg text-text-primary outline-none ring-brand-primary focus-visible:ring-2"
        aria-label="닫기"
        onClick={onClose}
      >
        <IcCloseSmall width={24} height={24} aria-hidden="true" />
      </button>
    </div>
  );
}
