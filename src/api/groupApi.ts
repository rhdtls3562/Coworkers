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
import type { GroupDetail } from '@/types/group';

export async function getTeamDetail(groupId: QueryKeyId) {
  return apiClient<GroupDetail>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${groupId}`),
  );
}

export async function getTeamTasksByDate(
  groupId: QueryKeyId,
  params: TeamScopedDateQueryParams,
) {
  const endpoint = `${teamEndpoint(
    `${API_PATH_SEGMENTS.GROUPS}/${groupId}${API_PATH_SEGMENTS.TASKS}`,
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

export async function updateGroup(
  teamId: string,
  groupId: QueryKeyId,
  body: UpdateGroupBody,
) {
  return apiClient<GroupDetail>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${groupId}`, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
    },
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

export async function updateGroup(
  groupId: QueryKeyId,
  body: { image?: string; name: string },
) {
  return apiClient<unknown>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${groupId}`),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
    },
  );
}

export async function deleteGroup(groupId: QueryKeyId) {
  return apiClient<unknown>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${groupId}`),
    {
      method: HTTP_METHODS.DELETE,
    },
  );
}

export async function removeMemberGroup(
  groupId: QueryKeyId,
  memberUserId: QueryKeyId,
) {
  return apiClient<unknown>(
    teamEndpoint(
      `${API_PATH_SEGMENTS.GROUPS}/${groupId}/member/${memberUserId}`,
    ),
    {
      method: HTTP_METHODS.DELETE,
    },
  );
}

export async function getGroupInvitation(groupId: QueryKeyId) {
  return apiClient<string>(
    teamEndpoint(`${API_PATH_SEGMENTS.GROUPS}/${groupId}/invitation`),
  );
}
