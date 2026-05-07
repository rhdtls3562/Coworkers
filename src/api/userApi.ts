/**
 * 내 정보, 멤버십, 완료한 할 일 이력, 계정 설정 관련 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { buildQueryString } from '@/api/buildQueryString';
import { HTTP_METHODS } from '@/api/constants';
import type {
  CompletedTaskHistoryQueryParams,
  QueryParams,
} from '@/api/queryKeys';

export async function getMe() {
  return apiClient<unknown>(teamEndpoint('/user'));
}

export async function deleteMe() {
  return apiClient<void>(teamEndpoint('/user'), {
    method: HTTP_METHODS.DELETE,
  });
}

export async function getMyGroups(params?: QueryParams) {
  const endpoint = `${teamEndpoint('/user/groups')}${buildQueryString(params)}`;

  return apiClient<unknown>(endpoint);
}

export async function getMyMemberships(params?: QueryParams) {
  const endpoint = `${teamEndpoint('/user/memberships')}${buildQueryString(
    params,
  )}`;

  return apiClient<unknown>(endpoint);
}

export async function getCompletedTasks(
  params?: CompletedTaskHistoryQueryParams,
) {
  const endpoint = `${teamEndpoint('/user/history')}${buildQueryString(params)}`;

  return apiClient<unknown>(endpoint);
}
