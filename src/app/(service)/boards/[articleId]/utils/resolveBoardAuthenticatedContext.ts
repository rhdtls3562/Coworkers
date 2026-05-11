/**
 * 게시글 상세에서 팀 스코프 API를 호출하기 전에 `teamId`와 액세스 토큰을 한 번에 검증합니다.
 */

import type { ToastType } from '@/components/common/toast/types';
import { getStoredAccessToken } from '@/utils/authSession';

type ShowToast = (message: string, type: ToastType) => string;

export function resolveBoardAuthenticatedContext(params: {
  teamId: string;
  showToast: ShowToast;
}): { teamId: string; token: string } | null {
  const { teamId, showToast } = params;

  if (!teamId) {
    showToast('팀 정보가 설정되지 않았습니다.', 'error');
    return null;
  }

  const token = getStoredAccessToken();
  if (!token) {
    showToast('로그인이 필요합니다.', 'error');
    return null;
  }

  return { teamId, token };
}
