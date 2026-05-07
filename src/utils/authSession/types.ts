export type AuthSessionChangeReason =
  | 'saved'
  | 'manual'
  | 'expired'
  | 'unauthorized';

export type AuthSessionUser = {
  email?: string;
  image?: string | null;
  nickname?: string;
  teamName?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user?: AuthSessionUser;
};
