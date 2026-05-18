/**
 * 팀 생성, 수정, 삭제, 멤버 초대 등 팀/그룹 관련 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { buildQueryString } from '@/api/buildQueryString';
import { API_PATH_SEGMENTS, HTTP_METHODS } from '@/api/constants';
import type { QueryKeyId, TeamScopedDateQueryParams } from '@/api/queryKeys';
import type {
  AcceptGroupInvitationBody,
  AcceptGroupInvitationResponse,
  CreateGroupBody,
  CreateGroupResponse,
  UpdateGroupBody,
} from '@/api/types';
import type { GroupDetail, GroupMember } from '@/types/group';
import type { Task, TaskListSummary } from '@/types/task';

function isObjectEntry<T extends object>(
  value: T | null | undefined,
): value is T {
  return typeof value === 'object' && value !== null;
}

function sanitizeTasks(tasks: Task[] | null | undefined) {
  return (tasks ?? []).reduce<Task[]>((safeTasks, task) => {
    if (isObjectEntry(task)) {
      safeTasks.push(task);
    }

    return safeTasks;
  }, []);
}

function sanitizeTaskLists(taskLists: TaskListSummary[] | null | undefined) {
  return (taskLists ?? []).reduce<TaskListSummary[]>(
    (safeTaskLists, taskList) => {
      if (!isObjectEntry(taskList)) {
        return safeTaskLists;
      }

      safeTaskLists.push({
        ...taskList,
        tasks: sanitizeTasks(taskList.tasks),
      });

      return safeTaskLists;
    },
    [],
  );
}

function sanitizeMembers(members: GroupMember[] | null | undefined) {
  return (members ?? []).reduce<GroupMember[]>((safeMembers, member) => {
    if (isObjectEntry(member)) {
      safeMembers.push(member);
    }

    return safeMembers;
  }, []);
}

function sanitizeGroupDetail(groupDetail: GroupDetail): GroupDetail {
  return {
    ...groupDetail,
    members: sanitizeMembers(groupDetail.members),
    taskLists: sanitizeTaskLists(groupDetail.taskLists),
  };
}

export async function getTeamDetail(teamId: QueryKeyId) {
  const groupDetail = await apiClient<GroupDetail>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${teamId}`),
  );

  return sanitizeGroupDetail(groupDetail);
}

export async function getTeamTasksByDate(
  teamId: QueryKeyId,
  params: TeamScopedDateQueryParams,
) {
  const endpoint = `${teamEndpoint(
    `${API_PATH_SEGMENTS.GROUPS}/${teamId}${API_PATH_SEGMENTS.TASKS}`,
  )}${buildQueryString(params)}`;

  return apiClient<unknown>(endpoint);
}

export async function createGroup(teamId: string, body: CreateGroupBody) {
  return apiClient<CreateGroupResponse>(
    teamEndpoint(API_PATH_SEGMENTS.GROUPS, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}

export async function updateGroup(teamId: string, body: UpdateGroupBody) {
  return apiClient<GroupDetail>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${teamId}`),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
    },
  );
}

export async function deleteGroup(groupId: QueryKeyId) {
  return apiClient<void>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${groupId}`),
    {
      method: HTTP_METHODS.DELETE,
    },
  );
}

export async function removeMemberGroup(
  teamId: QueryKeyId,
  memberUserId: QueryKeyId,
) {
  return apiClient<unknown>(
    teamEndpoint(
      `${API_PATH_SEGMENTS.GROUPS}/${teamId}/member/${memberUserId}`,
    ),
    {
      method: HTTP_METHODS.DELETE,
    },
  );
}

export async function getGroupInvitation(teamId: QueryKeyId) {
  return apiClient<string>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${teamId}/invitation`),
  );
}
export async function acceptGroupInvitation(
  teamId: string,
  body: AcceptGroupInvitationBody,
) {
  return apiClient<AcceptGroupInvitationResponse>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/accept-invitation`, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}
