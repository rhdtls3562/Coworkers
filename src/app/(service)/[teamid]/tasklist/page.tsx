/**
 * 할 일 리스트 페이지를 구성하는 파일입니다.
 * 태블릿(md~lg)은 상단 패딩을 넉넉히 둡니다.
 * md+: 사이드바 노출 구간부터 좌우 패딩 확보. lg+는 더 넓게.
 */

import TaskListPageShell from '@/app/(service)/[teamid]/tasklist/components/TaskListPageShell';

export default async function TaskListPage({
  params,
}: {
  params: Promise<{ teamid: string }>;
}) {
  const { teamid } = await params;

  return (
    <div className="min-w-0 px-4 pb-4 pt-0 sm:px-5 sm:pt-0 md:px-10 md:pb-6 md:pt-20 lg:px-21 lg:pt-30">
      <TaskListPageShell teamId={teamid} />
    </div>
  );
}
