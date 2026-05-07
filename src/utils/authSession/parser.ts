import { isRecord } from '@/utils/authSession/browser';
import type { AuthSession, AuthSessionUser } from '@/utils/authSession/types';

function toAuthSessionUser(value: unknown): AuthSessionUser | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    email: typeof value.email === 'string' ? value.email : undefined,
    image:
      typeof value.image === 'string' || value.image === null
        ? value.image
        : undefined,
    nickname: typeof value.nickname === 'string' ? value.nickname : undefined,
    teamName: typeof value.teamName === 'string' ? value.teamName : undefined,
  };
}

export function extractAuthSession(data: unknown): AuthSession | null {
  if (!isRecord(data)) {
    return null;
  }

  const candidates = [
    data,
    isRecord(data.data) ? data.data : null,
    isRecord(data.session) ? data.session : null,
    isRecord(data.authSession) ? data.authSession : null,
  ].filter(
    (candidate): candidate is Record<string, unknown> => candidate !== null,
  );

  for (const candidate of candidates) {
    if (
      typeof candidate.accessToken === 'string' &&
      typeof candidate.refreshToken === 'string'
    ) {
      return {
        accessToken: candidate.accessToken,
        refreshToken: candidate.refreshToken,
        user: toAuthSessionUser(candidate.user),
      };
    }
  }

  return null;
}
