/**
 * 완료 이력과 할 일 목록 상세 응답을 화면용 데이터로 변환하는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  HistoryTaskListTask,
  MyHistoryCompletedTaskRecord,
} from '@/app/(service)/myhistory/types';
import {
  isRecord,
  toNumber,
} from '@/app/(service)/myhistory/utils/myHistoryShared';

export function toCompletedTaskRecords(data: unknown) {
  if (!isRecord(data)) {
    return [] as MyHistoryCompletedTaskRecord[];
  }

  const candidate = isRecord(data.data) ? data.data : data;
  const taskList = Array.isArray(candidate.tasksDone)
    ? candidate.tasksDone
    : [];

  return taskList.filter(isRecord).map((task) => ({
    date: typeof task.date === 'string' ? task.date : undefined,
    description:
      typeof task.description === 'string' ? task.description : undefined,
    displayIndex: toNumber(task.displayIndex),
    doneAt: typeof task.doneAt === 'string' ? task.doneAt : undefined,
    frequency: typeof task.frequency === 'string' ? task.frequency : undefined,
    id:
      typeof task.id === 'number' || typeof task.id === 'string'
        ? String(task.id)
        : undefined,
    name: typeof task.name === 'string' ? task.name : undefined,
  }));
}

export function toHistoryTaskListDetailSource(
  data: unknown,
  descriptor: Omit<HistoryTaskListDetailSource, 'tasks'>,
) {
  if (!isRecord(data) || !Array.isArray(data.tasks)) {
    return {
      ...descriptor,
      tasks: [],
    } satisfies HistoryTaskListDetailSource;
  }

  return {
    ...descriptor,
    tasks: data.tasks.reduce<HistoryTaskListTask[]>((tasks, task) => {
      if (!isRecord(task)) {
        return tasks;
      }

      const taskId =
        typeof task.id === 'number' || typeof task.id === 'string'
          ? String(task.id)
          : null;
      const taskName = typeof task.name === 'string' ? task.name : null;

      if (!taskId || !taskName) {
        return tasks;
      }

      const doneByUserId =
        isRecord(task.doneBy) &&
        isRecord(task.doneBy.user) &&
        (typeof task.doneBy.user.id === 'number' ||
          typeof task.doneBy.user.id === 'string')
          ? task.doneBy.user.id
          : undefined;

      tasks.push({
        commentCount: toNumber(task.commentCount) ?? 0,
        description:
          typeof task.description === 'string' ? task.description : '',
        displayIndex: toNumber(task.displayIndex) ?? 0,
        doneAt: typeof task.doneAt === 'string' ? task.doneAt : undefined,
        doneByUserId,
        frequency:
          typeof task.frequency === 'string' ? task.frequency : undefined,
        id: taskId,
        name: taskName,
      });

      return tasks;
    }, []),
  } satisfies HistoryTaskListDetailSource;
}
