/**
 * 팀 생성, 수정, 삭제, 멤버 초대 등 팀/그룹 관련 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { buildQueryString } from '@/api/buildQueryString';
import { API_PATH_SEGMENTS } from '@/api/constants';
import type { QueryKeyId, TeamScopedDateQueryParams } from '@/api/queryKeys';

export async function getTeamDetail(groupId: QueryKeyId) {
  return apiClient<unknown>(
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
