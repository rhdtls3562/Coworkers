/**
 * 리스트 페이지의 할 일 체크 상태와 목록 삭제 결과를 캐시에 즉시 반영하는 유틸입니다.
 */

import type { GroupDetail } from '@/types/group';
import type { TaskListDetail } from '@/types/task';

function applyDoneAt<T extends { doneAt: string | null; id: number }>(
  tasks: readonly T[],
  taskId: string,
  checked: boolean,
) {
  return tasks.map((task) =>
    String(task.id) === taskId
      ? {
          ...task,
          doneAt: checked ? new Date().toISOString() : null,
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
