/**
 * 할 일 생성 모달의 제출 로직을 담당하는 훅 파일입니다.
 */

'use client';

import { createRecurring } from '@/api/taskApi';
import {
  buildTaskListRecurringBody,
  resolveTaskListRecurringStartDate,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskPayload';
import { useToast } from '@/components/common/toast';

type UseTaskListCreateTaskSubmitParams = {
  groupId: number;
  memo: string;
  monthDay: number;
  onClose: () => void;
  onSubmit?: (selectedDate: Date) => void | Promise<void>;
  repeat: 'once' | 'daily' | 'weekly' | 'monthly';
  selectedDate: Date;
  startTime: string;
  taskListId: string;
  title: string;
  weekDays: number[];
};

export default function useTaskListCreateTaskSubmit({
  groupId,
  memo,
  monthDay,
  onClose,
  onSubmit,
  repeat,
  selectedDate,
  startTime,
  taskListId,
  title,
  weekDays,
}: UseTaskListCreateTaskSubmitParams) {
  const { showToast } = useToast();

  const handleCreateTask = async () => {
    if (title.trim().length === 0) return;

    const body = buildTaskListRecurringBody({
      description: memo.trim(),
      monthDay,
      repeat,
      selectedDate,
      startTime,
      title: title.trim(),
      weekDays,
    });
    const createdStartDate = resolveTaskListRecurringStartDate(
      repeat,
      selectedDate,
      monthDay,
      weekDays,
    );

    try {
      await createRecurring(String(groupId), taskListId, body);
      await onSubmit?.(createdStartDate);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '할 일 생성 중 오류가 발생했습니다.';

      showToast(message, 'error');
    }
  };

  return { handleCreateTask };
}
