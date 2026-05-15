'use client';

import type { TaskListTaskDetailPanelProps } from '@/app/(service)/[teamid]/tasklist/types';
import TaskDetailPanelContent from '@/components/common/rightPanel/components/TaskDetailPanelContent';

const API_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

// TaskListTaskDetailPanel
export default function TaskListTaskDetailPanel({
  initialMode,
  task,
  teamId,
}: TaskListTaskDetailPanelProps) {
  const isDone = task.checked;

  return (
    <TaskDetailPanelContent
      key={`${task.id}-${initialMode}`}
      apiTeamId={API_TEAM_ID}
      assigneeImage={task.assigneeImage}
      assigneeName={task.assigneeName}
      description={task.description}
      frequency={task.repeatLabel}
      initialMode={initialMode}
      scheduleEditConfig={{
        frequencyType: task.frequency,
        recurringId: task.recurringId,
        startedAtRaw: task.startDate ?? task.startedAtRaw,
        weekDays: task.weekDays,
      }}
      startedAt={task.startedAtLabel}
      taskId={task.id}
      taskListId={task.taskListId}
      teamId={teamId}
      title={task.title}
      completionActionDoneValue={!isDone}
      completionActionLabel={isDone ? '완료 취소하기' : '완료하기'}
    />
  );
}
