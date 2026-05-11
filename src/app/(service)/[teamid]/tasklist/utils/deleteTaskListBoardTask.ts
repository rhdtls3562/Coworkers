/**
 * 리스트 페이지 할 일 삭제 시 일반 할 일과 반복 할 일의 API 경로를 구분하는 유틸입니다.
 */

import { deleteRecurring, deleteTask } from '@/api/taskApi';
import type { TaskListBoardTask } from '@/app/(service)/[teamid]/tasklist/types';

export async function deleteTaskListBoardTask(
  groupId: string,
  taskListId: string,
  task: TaskListBoardTask,
) {
  if (task.frequency !== 'ONCE' && task.recurringId) {
    return deleteRecurring(groupId, taskListId, task.id, task.recurringId);
  }

  return deleteTask(groupId, taskListId, task.id);
}
