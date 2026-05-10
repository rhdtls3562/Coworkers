'use client';

import type { TaskListTaskDetailPanelProps } from '@/app/(service)/[teamid]/tasklist/types';
import TaskDetailPanelContent from '@/components/common/rightPanel/components/TaskDetailPanelContent';

const API_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function TaskListTaskDetailPanel({
  initialMode,
  task,
  teamId,
}: TaskListTaskDetailPanelProps) {
  return (
    <TaskDetailPanelContent
      key={`${task.id}-${initialMode}`}
      apiTeamId={API_TEAM_ID}
      assigneeName={task.assigneeName}
      description={task.description}
      frequency={task.repeatLabel}
      initialMode={initialMode}
      startedAt={task.startedAtLabel}
      taskId={task.id}
      taskListId={task.taskListId}
      teamId={teamId}
      title={task.title}
    />
  );
}
