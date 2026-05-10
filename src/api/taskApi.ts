/**
 * 할 일과 할 일 목록 생성, 수정, 삭제, 완료 처리 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { buildQueryString } from '@/api/buildQueryString';
import { API_PATH_SEGMENTS, HTTP_METHODS } from '@/api/constants';
import type {
  QueryKeyId,
  TaskQueryParams,
  TeamScopedDateQueryParams,
} from '@/api/queryKeys';
import type { RecurringBody, TaskUpdateBody } from '@/api/types';
import type { TaskListDetail } from '@/types/task';

function createGroupTaskListsPath(groupId: QueryKeyId) {
  return `${API_PATH_SEGMENTS.GROUPS}/${groupId}${API_PATH_SEGMENTS.TASK_LISTS}`;
}

function createTaskListPath(groupId: QueryKeyId, taskListId: QueryKeyId) {
  return `${createGroupTaskListsPath(groupId)}/${taskListId}`;
}

function createTaskListTasksPath(groupId: QueryKeyId, taskListId: QueryKeyId) {
  return `${createTaskListPath(groupId, taskListId)}${API_PATH_SEGMENTS.TASKS}`;
}

function createTaskDetailPath(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  taskId: QueryKeyId,
) {
  return `${createTaskListTasksPath(groupId, taskListId)}/${taskId}`;
}

function createRecurringPath(groupId: QueryKeyId, taskListId: QueryKeyId) {
  return `${createTaskListPath(groupId, taskListId)}${API_PATH_SEGMENTS.RECURRING}`;
}

export async function createTaskList(
  groupId: QueryKeyId,
  body: { name: string },
) {
  return apiClient<unknown>(teamEndpoint(createGroupTaskListsPath(groupId)), {
    body: JSON.stringify(body),
    method: HTTP_METHODS.POST,
  });
}

export async function getTaskListDetail(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  params?: TeamScopedDateQueryParams,
) {
  const endpoint = `${teamEndpoint(
    createTaskListPath(groupId, taskListId),
  )}${buildQueryString(params)}`;

  return apiClient<TaskListDetail>(endpoint);
}

export async function getTasks(groupId: QueryKeyId, params: TaskQueryParams) {
  const { taskListId, ...queryParams } = params;

  if (!taskListId) {
    throw new Error('taskListId is required.');
  }

  const endpoint = `${teamEndpoint(
    createTaskListTasksPath(groupId, taskListId),
  )}${buildQueryString(queryParams)}`;

  return apiClient<unknown>(endpoint);
}

export async function getTaskDetail(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  taskId: QueryKeyId,
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskDetailPath(groupId, taskListId, taskId)),
  );
}

export async function updateTask(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  taskId: QueryKeyId,
  body: TaskUpdateBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskDetailPath(groupId, taskListId, taskId)),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
      token,
    },
  );
}

export async function deleteTask(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  taskId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskDetailPath(groupId, taskListId, taskId)),
    {
      method: HTTP_METHODS.DELETE,
      token,
    },
  );
}

export async function createRecurring(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  body: RecurringBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createRecurringPath(groupId, taskListId)),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
      token,
    },
  );
}

export async function updateRecurring(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  recurringId: QueryKeyId,
  body: RecurringBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(`${createRecurringPath(groupId, taskListId)}/${recurringId}`),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
      token,
    },
  );
}

export async function deleteRecurring(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  taskId: QueryKeyId,
  recurringId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(
      `${createTaskDetailPath(groupId, taskListId, taskId)}${API_PATH_SEGMENTS.RECURRING}/${recurringId}`,
    ),
    {
      method: HTTP_METHODS.DELETE,
      token,
    },
  );
}

export async function createTaskList(
  groupId: QueryKeyId,
  body: { name: string },
) {
  return apiClient<unknown>(teamEndpoint(createGroupTaskListsPath(groupId)), {
    body: JSON.stringify(body),
    method: HTTP_METHODS.POST,
  });
}

export async function updateTaskList(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
  body: { name: string },
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskListPath(groupId, taskListId)),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
    },
  );
}

export async function deleteTaskList(
  groupId: QueryKeyId,
  taskListId: QueryKeyId,
) {
  return apiClient<void>(
    teamEndpoint(createTaskListPath(groupId, taskListId)),
    {
      method: HTTP_METHODS.DELETE,
    },
  );
}
