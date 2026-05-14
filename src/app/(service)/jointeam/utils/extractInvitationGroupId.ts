/**
 * 팀 참여 링크 또는 groupId 문자열에서 실제 팀 식별자만 추출합니다.
 */

const URL_BASE = 'https://coworkers.local';

function normalizeInvitationGroupId(value: string) {
  return /^\d+$/.test(value) ? value : '';
}

export function extractInvitationGroupId(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  try {
    const parsedUrl = new URL(trimmedValue, URL_BASE);
    const groupId = parsedUrl.searchParams.get('groupId');

    if (groupId) {
      return normalizeInvitationGroupId(groupId);
    }

    if (trimmedValue.startsWith('/') || /^https?:\/\//.test(trimmedValue)) {
      return '';
    }
  } catch {
    return '';
  }

  return normalizeInvitationGroupId(trimmedValue);
}
