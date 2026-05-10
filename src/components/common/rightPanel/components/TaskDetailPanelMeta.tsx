/**
 * 오른쪽 패널 상세 화면 상단 메타 정보를 렌더링하는 컴포넌트입니다.
 */

'use client';

import { IcCalendarSmall, IcRepeatSmall, IcUserLarge } from '@/assets';
import type { TaskDetailPanelMetaProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelMeta({
  assigneeName,
  frequency,
  startedAt,
}: TaskDetailPanelMetaProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary md:size-9">
          <IcUserLarge width={20} height={20} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-text-primary md:text-base">
          {assigneeName}
        </span>
      </div>

      <dl className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-text-default md:gap-3">
        <div className="flex items-center gap-2">
          <IcCalendarSmall
            width={16}
            height={16}
            className="size-4"
            aria-hidden="true"
          />
          <dt>시작 날짜</dt>
          <dd className="text-text-secondary">{startedAt}</dd>
        </div>

        <div className="flex items-center gap-2">
          <IcRepeatSmall
            width={20}
            height={20}
            className="size-4"
            aria-hidden="true"
          />
          <dt>반복 설정</dt>
          <dd className="text-text-secondary">{frequency}</dd>
        </div>
      </dl>
    </div>
  );
}
