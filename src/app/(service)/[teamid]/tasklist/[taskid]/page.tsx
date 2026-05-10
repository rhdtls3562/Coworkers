import TaskListPageShell from '@/app/(service)/[teamid]/tasklist/components/TaskListPageShell';

export default async function TaskListItemPage({
  params,
}: {
  params: Promise<{ teamid: string; taskid: string }>;
}) {
  const { teamid, taskid } = await params;

  return (
    <div className="min-w-0 px-4 pb-4 pt-0 sm:px-5 sm:pt-0 md:px-10 md:pb-6 md:pt-20 lg:px-21 lg:pt-30">
      <TaskListPageShell teamId={teamid} taskId={taskid} />
    </div>
  );
}
