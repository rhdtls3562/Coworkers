export type AuthSessionChangeReason =
  | 'saved'
  | 'refreshed'
  | 'manual'
  | 'expired'
  | 'unauthorized';

export type AuthSessionProvider = 'google' | 'kakao';

export type AuthSessionUser = {
  email?: string;
  image?: string | null;
  nickname?: string;
  provider?: AuthSessionProvider;
  teamName?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user?: AuthSessionUser;
};
