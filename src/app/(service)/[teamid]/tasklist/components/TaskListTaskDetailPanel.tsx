'use client';

/**
 * 할 일 리스트에서 공통 오른쪽 패널을 열기 위한 tasklist 전용 래퍼입니다.
 */

import type { TaskListTaskDetailPanelProps } from '@/app/(service)/[teamid]/tasklist/types';
import TaskDetailPanelContent from '@/components/common/rightPanel/components/TaskDetailPanelContent';

const API_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function TaskListTaskDetailPanel({
  initialMode,
  onDeleteTask,
  onSyncTaskChecked,
  onSyncTaskDetail,
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
      onTaskDeleted={() => {
        onDeleteTask(task.id);
      }}
      onTaskUpdated={(title, description) => {
        onSyncTaskDetail(task.id, {
          description,
          title,
        });
      }}
      onTaskCheckedChanged={(checked) => {
        onSyncTaskChecked(task.id, checked);
      }}
    />
  );
}
