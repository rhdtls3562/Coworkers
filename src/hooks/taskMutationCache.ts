/**
 * 할 일 완료 상태 변경 시 필요한 캐시 반영과 후속 재검증을 모아둔 유틸입니다.
 */

'use client';

import type { QueryKeyId } from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import {
  syncCheckedTaskToGroupDetail,
  syncCheckedTaskToTaskListDetail,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListQueryCache';
import type { GroupDetail } from '@/types/group';
import type { TaskListDetail } from '@/types/task';

import type { QueryClient } from '@tanstack/react-query';

type SyncTaskCheckedCachesParams = {
  checked: boolean;
  queryClient: QueryClient;
  taskId: QueryKeyId;
  taskListId: QueryKeyId;
  teamId: string;
};

type InvalidateTaskCheckedFollowupsParams = {
  queryClient: QueryClient;
  taskId: QueryKeyId;
  taskListId: QueryKeyId;
  teamId: string;
};

export function syncTaskCheckedCaches({
  checked,
  queryClient,
  taskId,
  taskListId,
  teamId,
}: SyncTaskCheckedCachesParams) {
  const taskIdString = String(taskId);
  const taskListIdString = String(taskListId);

  queryClient.setQueryData<GroupDetail | undefined>(
    queryKeys.team.detail(teamId),
    (previousGroupDetail) =>
      syncCheckedTaskToGroupDetail(
        previousGroupDetail,
        taskListIdString,
        taskIdString,
        checked,
      ),
  );
  queryClient.setQueriesData<TaskListDetail | undefined>(
    {
      queryKey: queryKeys.taskList.detail(teamId, taskListId),
    },
    (previousTaskListDetail) =>
      syncCheckedTaskToTaskListDetail(
        previousTaskListDetail,
        taskIdString,
        checked,
      ),
  );
}

export async function invalidateTaskCheckedFollowups({
  queryClient,
  taskId,
  taskListId,
  teamId,
}: InvalidateTaskCheckedFollowupsParams) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.task.detail(teamId, taskId, taskListId),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.user.completedTasks(),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.user.completedTaskSummary(),
    }),
  ]);
}
