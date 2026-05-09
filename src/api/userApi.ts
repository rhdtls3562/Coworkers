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
import type {
  MembershipInfo,
  ResetPasswordBody,
  SendResetPasswordEmailBody,
  UserInfo,
} from '@/api/types';
import type { ChangePassword } from '@/app/(service)/mypage/types';

export async function getMe() {
  return apiClient<UserInfo>(teamEndpoint('/user'));
}
export async function updateMe(
  body: Partial<Pick<UserInfo, 'nickname' | 'image'>>,
) {
  return apiClient<UserInfo>(teamEndpoint('/user'), {
    method: HTTP_METHODS.PATCH,
    body: JSON.stringify(body),
  });
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
  const endpoint = `${teamEndpoint('/user/memberships')}${buildQueryString(params)}`;
  return apiClient<MembershipInfo>(endpoint);
}

export async function getCompletedTasks(
  params?: CompletedTaskHistoryQueryParams,
) {
  const endpoint = `${teamEndpoint('/user/history')}${buildQueryString(params)}`;
  return apiClient<unknown>(endpoint);
}

export async function changePassword(body: ChangePassword) {
  return apiClient<{ message: string }>(teamEndpoint('/user/password'), {
    method: HTTP_METHODS.PATCH,
    body: JSON.stringify(body),
  });
}

export async function sendResetPasswordEmail(
  teamId: string,
  body: SendResetPasswordEmailBody,
) {
  return apiClient<{ message: string }>(
    teamEndpoint('/user/send-reset-password-email', teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}

export async function resetPassword(teamId: string, body: ResetPasswordBody) {
  return apiClient<{ message: string }>(
    teamEndpoint('/user/reset-password', teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
    },
  );
}
