/**
 * 선택한 할 일 목록 상세 리스트 페이지의 서버 래퍼입니다.
 */

import TaskListPageShell from '@/app/(service)/[teamid]/tasklist/components/TaskListPageShell';
import type { TaskListItemPageParams } from '@/app/(service)/[teamid]/tasklist/types';

export default async function TaskListItemPage({
  params,
}: {
  params: TaskListItemPageParams;
}) {
  const { teamid, taskid } = await params;

  return (
    <div className="min-w-0 px-4 pb-4 pt-0 sm:px-5 sm:pt-0 md:px-10 md:pb-6 md:pt-20 lg:px-21 lg:pt-30">
      <TaskListPageShell teamId={teamid} taskId={taskid} />
    </div>
  );
}
