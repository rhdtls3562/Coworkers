import TaskGroup from '@/app/(service)/[teamid]/components/TaskGroup';
import { STATUS } from '@/app/(service)/[teamid]/constants';
import { TeamDetailData } from '@/app/(service)/[teamid]/types';

export default function TeamTaskList({ taskLists }: TeamDetailData) {
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
          <TaskGroup key={status} status={status} taskLists={taskLists} />
        ))}
      </div>{' '}
      {taskLists.length === 0 && (
        <div className=" items-center justify-center rounded-2xl py-20 text-sm font-normal text-text-default hidden xl:py-40 xl:flex">
          아직 등록된 할 일이 없어요.
        </div>
      )}
    </section>
  );
}
