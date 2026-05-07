/**
 * 로그인, 회원가입, 토큰 갱신 등 인증 관련 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { API_PATH_SEGMENTS, HTTP_METHODS } from '@/api/constants';
import type { QueryKeyId } from '@/api/queryKeys';
import type {
  RefreshTokenBody,
  SignInBody,
  SignInWithOauthBody,
  SignUpBody,
} from '@/api/types';

export async function signUp(teamId: string, body: SignUpBody) {
  return apiClient<unknown>(
    teamEndpoint(`${API_PATH_SEGMENTS.AUTH}/signUp`, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}

export async function signIn(teamId: string, body: SignInBody) {
  return apiClient<unknown>(
    teamEndpoint(`${API_PATH_SEGMENTS.AUTH}/signIn`, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}

export async function refreshAccessToken(
  teamId: string,
  body: RefreshTokenBody,
) {
  return apiClient<unknown>(
    teamEndpoint(`${API_PATH_SEGMENTS.AUTH}/refresh-token`, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}

export async function signInWithOauth(
  teamId: string,
  provider: QueryKeyId,
  body: SignInWithOauthBody,
) {
  return apiClient<unknown>(
    teamEndpoint(`${API_PATH_SEGMENTS.AUTH}/signIn/${provider}`, teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
    },
  );
}
