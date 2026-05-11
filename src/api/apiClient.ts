/**
 * 팀 스코프 API URL 생성과 공통 fetch 에러 처리를 담당하는 클라이언트입니다.
 */

import type { ApiError, FetchOptions } from '@/api/types';
import {
  clearAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
} from '@/utils/authSession';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

function normalizeEndpoint(endpoint: string) {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
}

export function teamEndpoint(endpoint: string, teamId = TEAM_ID) {
  if (!teamId) {
    throw new Error('NEXT_PUBLIC_TEAM_ID is not configured.');
  }

  return `/${teamId}${normalizeEndpoint(endpoint)}`;
}

export function buildApiUrl(endpoint: string) {
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint;
  }

  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  return `${BASE_URL.replace(/\/$/, '')}${normalizeEndpoint(endpoint)}`;
}

async function getErrorMessage(res: Response) {
  const contentType = res.headers.get('Content-Type');

  if (!contentType?.includes('application/json')) {
    return `API Error: ${res.status}`;
  }

  const data = (await res.json().catch(() => null)) as {
    message?: string;
  } | null;

  return data?.message ?? `API Error: ${res.status}`;
}

function createApiError(message: string, status?: number): ApiError {
  return Object.assign(new Error(message), {
    status,
  });
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(buildApiUrl(teamEndpoint('/auth/refresh-token')), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { accessToken: string };
    setStoredAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...rest } = options;
  const accessToken = token ?? getStoredAccessToken();
  const headers = new Headers(rest.headers);
  const isFormData =
    typeof FormData !== 'undefined' && rest.body instanceof FormData;

  if (rest.body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(buildApiUrl(endpoint), {
    ...rest,
    headers,
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      const retryRes = await fetch(buildApiUrl(endpoint), {
        ...rest,
        headers,
      });

      if (retryRes.ok) {
        if (retryRes.status === 204) return undefined as T;
        return retryRes.json() as Promise<T>;
      }
    }

    clearAuthSession('unauthorized');
    throw createApiError(
      '로그인이 만료되었습니다. 다시 로그인해주세요.',
      res.status,
    );
  }

  if (!res.ok) {
    throw createApiError(await getErrorMessage(res), res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
