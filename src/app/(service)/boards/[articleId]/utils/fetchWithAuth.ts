/**
 * 서버 환경에서 쿠키 access-token을 붙여 팀 API 엔드포인트를 호출하는 유틸입니다.
 */

import { cookies } from 'next/headers';

import { apiClient } from '@/api/apiClient';

export async function fetchWithAuth(endpoint: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access-token')?.value;
  return apiClient<unknown>(endpoint, {
    cache: 'no-store',
    token: accessToken,
  });
}
