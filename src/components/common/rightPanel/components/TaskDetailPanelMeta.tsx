/**
 * 오른쪽 패널 상세 화면 상단 메타 정보를 렌더링하는 컴포넌트입니다.
 */

'use client';

import { IcCalendarSmall, IcClockSmall, IcRepeatSmall } from '@/assets';
import RightPanelAvatar from '@/components/common/rightPanel/components/RightPanelAvatar';
import type { TaskDetailPanelMetaProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelMeta({
  assigneeImage,
  assigneeName,
  frequency,
  isEditing,
  isScheduleEditable,
  onEditSchedule,
  startedAt,
  startedAtLabelText,
  startedTimeAtLabelText,
  startTime,
}: TaskDetailPanelMetaProps) {
  const scheduleValueClassName = 'min-w-0 truncate text-text-secondary';

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <RightPanelAvatar alt="" image={assigneeImage} />
        <span className="text-sm font-semibold text-text-primary md:text-base">
          {assigneeName}
        </span>
      </div>

      <dl className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-text-default md:gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <IcCalendarSmall
            width={16}
            height={16}
            className="size-4 shrink-0"
            aria-hidden="true"
          />
          <dt>{startedAtLabelText}</dt>
          {isEditing && isScheduleEditable ? (
            <dd className="min-w-0">
              <button
                type="button"
                data-allow-unsaved="true"
                className="inline-flex min-w-0 max-w-full items-center border-b border-background-tertiary pb-1 text-left"
                onClick={onEditSchedule}
              >
                <span className={scheduleValueClassName}>{startedAt}</span>
              </button>
            </dd>
          ) : (
            <dd className={scheduleValueClassName}>{startedAt}</dd>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IcClockSmall
            width={16}
            height={16}
            className="size-4 shrink-0"
            aria-hidden="true"
          />
          <dt>{startedTimeAtLabelText}</dt>
          {isEditing && isScheduleEditable ? (
            <dd className="min-w-0">
              <button
                type="button"
                data-allow-unsaved="true"
                className="inline-flex min-w-0 max-w-full items-center border-b border-background-tertiary pb-1 text-left"
                onClick={onEditSchedule}
              >
                <span className={scheduleValueClassName}>{startTime}</span>
              </button>
            </dd>
          ) : (
            startTime && <dd className={scheduleValueClassName}>{startTime}</dd>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IcRepeatSmall
            width={20}
            height={20}
            className="size-4 shrink-0"
            aria-hidden="true"
          />
          <dt>반복 설정</dt>
          {isEditing && isScheduleEditable ? (
            <dd className="min-w-0">
              <button
                type="button"
                data-allow-unsaved="true"
                className="inline-flex min-w-0 max-w-full items-center border-b border-background-tertiary pb-1 text-left"
                onClick={onEditSchedule}
              >
                <span className={scheduleValueClassName}>{frequency}</span>
              </button>
            </dd>
          ) : (
            <dd className={scheduleValueClassName}>{frequency}</dd>
          )}
        </div>
      </dl>
    </div>
  );
}
