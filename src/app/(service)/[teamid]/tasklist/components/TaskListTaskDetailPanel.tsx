'use client';

import type { TaskListTaskDetailPanelProps } from '@/app/(service)/[teamid]/tasklist/types';
import TaskDetailPanelContent from '@/components/common/rightPanel/components/TaskDetailPanelContent';
import { useMeQuery } from '@/hooks/useUser';

const API_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function TaskListTaskDetailPanel({
  initialMode,
  onScheduleSaved,
  task,
  teamId,
}: TaskListTaskDetailPanelProps) {
  const isDone = task.checked;
  const { data: meData } = useMeQuery();

  // task.writer가 null인 경우 현재 로그인 유저 정보로 대체한다 (히스토리 패널과 동일한 방식)
  const assigneeName =
    task.assigneeName ||
    (typeof meData === 'object' &&
    meData !== null &&
    'nickname' in meData &&
    typeof meData.nickname === 'string'
      ? meData.nickname
      : '');
  const assigneeImage =
    task.assigneeImage ??
    (typeof meData === 'object' &&
    meData !== null &&
    'image' in meData &&
    typeof meData.image === 'string'
      ? meData.image
      : null);

  return (
    <TaskDetailPanelContent
      key={`${task.id}-${initialMode}`}
      apiTeamId={API_TEAM_ID}
      assigneeImage={assigneeImage}
      assigneeName={assigneeName}
      description={task.description}
      frequency={task.repeatLabel}
      initialMode={initialMode}
      onScheduleSaved={onScheduleSaved}
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
