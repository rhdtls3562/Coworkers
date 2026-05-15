/**
 * 오른쪽 패널 상단의 담당자·시작일·반복 정보 영역입니다.
 */

import Image from 'next/image';

import type { TaskListTaskDetailMetaProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcCalendarSmall, IcRepeatSmall, IcUserLarge } from '@/assets';

export default function TaskListTaskDetailMeta({
  assigneeImage,
  assigneeName,
  frequency,
  startedAtLabel,
  startedAtLabelText,
}: TaskListTaskDetailMetaProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        {assigneeImage ? (
          <Image
            src={assigneeImage}
            alt={`${assigneeName} 프로필`}
            width={36}
            height={36}
            className="size-8 shrink-0 rounded-lg object-cover md:size-9"
          />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary md:size-9">
            <IcUserLarge width={20} height={20} aria-hidden="true" />
          </span>
        )}
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
          <dd className="text-text-secondary">{startedAtLabel}</dd>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <IcRepeatSmall
            width={20}
            height={20}
            className="size-4 shrink-0"
            aria-hidden="true"
          />
          <dt>반복 설정</dt>
          <dd className="text-text-secondary">{frequency}</dd>
        </div>
      </dl>
    </div>
  );
}
