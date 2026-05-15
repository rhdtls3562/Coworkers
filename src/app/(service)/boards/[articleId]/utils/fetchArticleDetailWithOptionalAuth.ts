/**
 * 게시글 상세 GET을 서버에서 호출합니다. public 스코프 대응을 위해,
 * 만료 등으로 401이면 Authorization 없이 한 번 더 요청합니다.
 */

import { cookies } from 'next/headers';

import { buildApiUrl, teamEndpoint } from '@/api/apiClient';
import type { ApiError } from '@/api/types';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/authSession/constants';

async function getErrorMessageFromResponse(res: Response) {
  const contentType = res.headers.get('Content-Type');

  if (!contentType?.includes('application/json')) {
    return `API Error: ${res.status}`;
  }

  const data = (await res.json().catch(() => null)) as {
    message?: string;
  } | null;

  return data?.message ?? `API Error: ${res.status}`;
}

function createApiError(message: string, status: number): ApiError {
  return Object.assign(new Error(message), { status });
}

async function fetchArticleJson(
  url: string,
  accessToken: string | undefined,
): Promise<Response> {
  const headers = new Headers();

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return fetch(url, { cache: 'no-store', headers });
}

export async function fetchArticleDetailWithOptionalAuth(
  articleId: string,
  teamId: string,
) {
  const endpoint = teamEndpoint(`/articles/${articleId}`, teamId);
  const url = buildApiUrl(endpoint);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  let res = await fetchArticleJson(url, accessToken);

  if (res.status === 401 && accessToken) {
    res = await fetchArticleJson(url, undefined);
  }

  if (!res.ok) {
    throw createApiError(await getErrorMessageFromResponse(res), res.status);
  }

  if (res.status === 204) {
    return undefined;
  }

  return res.json() as Promise<unknown>;
}
