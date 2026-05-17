/** 팀 상세 페이지의 할 일 목록을 렌더링하는 컴포넌트입니다. */

import TaskGroup from '@/app/(service)/[teamid]/components/TaskGroup';
import { STATUS } from '@/app/(service)/[teamid]/constants';
import { TeamDetailData } from '@/app/(service)/[teamid]/types';
import { classifyTaskLists } from '@/app/(service)/[teamid]/utils/task';

export default function TeamTaskList({ taskLists }: TeamDetailData) {
  const classified = classifyTaskLists(taskLists);

  return (
    <section className="w-full px-4 flex flex-col gap-4 md:px-0 xl:px-0 xl:w-[calc(100%-264px)]">
      <h2 className="text-base text-text-primary font-medium flex gap-1 items-center xl:text-xl">
        할 일 목록
        <span className="text-base text-text-default font-normal">
          ({taskLists.length}개)
        </span>
      </h2>
      <div className="flex flex-col flex-nowrap gap-8 w-full xl:flex-row xl:gap-4">
        {STATUS.map((status) => (
          <TaskGroup
            key={status}
            status={status}
            taskLists={classified[status]}
            allEmpty={taskLists.length === 0}
          />
        ))}
      </div>
      {taskLists.length === 0 && (
        <div className=" items-center justify-center rounded-2xl py-20 text-sm font-normal text-text-default hidden xl:py-40 xl:flex">
          아직 등록된 할 일이 없어요.
        </div>
      )}
    </section>
  );
}
