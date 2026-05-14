/**
 * 오른쪽 패널 일정 수정 저장 후 반복 일정 관련 쿼리를 갱신하는 훅입니다.
 */

'use client';

import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { useUpdateRecurringMutation } from '@/hooks/useRecurring';

type UseTaskDetailScheduleRecurringMutationParams = {
  taskListId: string;
  teamId: string;
};

export default function useTaskDetailScheduleRecurringMutation({
  taskListId,
  teamId,
}: UseTaskDetailScheduleRecurringMutationParams) {
  const queryClient = useQueryClient();

  return useUpdateRecurringMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.team.detail(teamId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.taskList.detail(teamId, taskListId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.completedTasks(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.completedTaskSummary(),
        }),
      ]);
    },
  });
}
