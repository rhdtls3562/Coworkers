/**
 * 팀 초대 링크 또는 초대 토큰 문자열에서 실제 참여 토큰만 추출합니다.
 */

const URL_BASE = 'https://coworkers.local';

export function extractInvitationToken(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  try {
    const parsedUrl = new URL(trimmedValue, URL_BASE);
    const token = parsedUrl.searchParams.get('token');

    if (token) {
      return decodeURIComponent(token);
    }

    if (trimmedValue.startsWith('/') || /^https?:\/\//.test(trimmedValue)) {
      return '';
    }
  } catch {
    return '';
  }

  return trimmedValue;
}
