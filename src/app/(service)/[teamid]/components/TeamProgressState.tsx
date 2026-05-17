/** 팀 오늘 할 일·완료 수치를 표시하는 진행 상태 컴포넌트입니다. */

import { TeamProgressStatsProps } from '@/app/(service)/[teamid]/types';

export function TeamProgressStats({ today, done }: TeamProgressStatsProps) {
  return (
    <div className="flex items-end">
      <div className="px-4 flex flex-col gap-1 justify-center items-center border-r border-background-tertiary">
        <span className="text-sm font-medium text-interaction-inactive md:text-sm">
          오늘의 할 일
        </span>
        <p className="text-2xl text-text-default font-bold  md:text-[32px]">
          {today}
        </p>
      </div>
      <div className="pl-4 flex flex-col gap-1 justify-center items-center">
        <span className="text-sm font-medium text-interaction-inactive md:text-sm">
          완료 🙌
        </span>
        <p className="text-2xl text-brand-primary font-bold md:text-[32px]">
          {done}
        </p>
      </div>
    </div>
  );
}
