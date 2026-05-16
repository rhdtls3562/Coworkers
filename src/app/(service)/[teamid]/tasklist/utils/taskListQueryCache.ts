/**
 * 리스트 페이지의 할 일 체크 상태와 목록 삭제 결과를 캐시에 즉시 반영하는 유틸입니다.
 */

import type { GroupDetail } from '@/types/group';
import type { TaskListDetail } from '@/types/task';

function getKoreanDateTimeString(date = new Date()) {
  const koreanDate = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);

  return `${koreanDate.replace(' ', 'T')}+09:00`;
}

function applyDoneAt<T extends { doneAt: string | null; id: number }>(
  tasks: readonly T[],
  taskId: string,
  checked: boolean,
) {
  return tasks.map((task) =>
    String(task.id) === taskId
      ? {
          ...task,
          doneAt: checked ? getKoreanDateTimeString() : null,
        }
      : task,
  );
}

export function syncCheckedTaskToGroupDetail(
  groupDetail: GroupDetail | undefined,
  taskListId: string,
  taskId: string,
  checked: boolean,
) {
  if (!groupDetail) {
    return groupDetail;
  }

  return {
    ...groupDetail,
    taskLists: groupDetail.taskLists.map((taskList) =>
      String(taskList.id) === taskListId
        ? {
            ...taskList,
            tasks: applyDoneAt(taskList.tasks, taskId, checked),
          }
        : taskList,
    ),
  };
}

export function syncCheckedTaskToTaskListDetail(
  taskListDetail: TaskListDetail | undefined,
  taskId: string,
  checked: boolean,
) {
  if (!taskListDetail) {
    return taskListDetail;
  }

  return {
    ...taskListDetail,
    tasks: applyDoneAt(taskListDetail.tasks, taskId, checked),
  };
}

export function removeTaskFromGroupDetail(
  groupDetail: GroupDetail | undefined,
  taskListId: string,
  taskId: string,
) {
  if (!groupDetail) {
    return groupDetail;
  }

  return {
    ...groupDetail,
    taskLists: groupDetail.taskLists.map((taskList) =>
      String(taskList.id) === taskListId
        ? {
            ...taskList,
            tasks: taskList.tasks.filter((task) => String(task.id) !== taskId),
          }
        : taskList,
    ),
  };
}

export function removeTaskFromTaskListDetail(
  taskListDetail: TaskListDetail | undefined,
  taskId: string,
) {
  if (!taskListDetail) {
    return taskListDetail;
  }

  return {
    ...taskListDetail,
    tasks: taskListDetail.tasks.filter((task) => String(task.id) !== taskId),
  };
}

export function removeTaskListFromGroupDetail(
  groupDetail: GroupDetail | undefined,
  taskListId: string,
) {
  if (!groupDetail) {
    return groupDetail;
  }

  return {
    ...groupDetail,
    taskLists: groupDetail.taskLists.filter(
      (taskList) => String(taskList.id) !== taskListId,
    ),
  };
}
