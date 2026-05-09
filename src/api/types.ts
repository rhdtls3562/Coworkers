/**
 * API 레이어 전반에서 공통으로 사용하는 요청, 응답, 클라이언트 타입 모음입니다.
 */

import type { QueryParams } from '@/api/queryKeys';
import type { LoginFormValues, SignUpFormValues } from '@/types/auth';

import type { QueryClient, QueryKey } from '@tanstack/react-query';

export type FetchOptions = RequestInit & {
  token?: string;
};

export type ApiError = Error & {
  status?: number;
};

export type SignUpBody = SignUpFormValues & {
  image?: string;
};

export type SignInBody = LoginFormValues;

export type RefreshTokenBody = {
  refreshToken: string;
};

export type SignInWithOauthBody = {
  redirectUri?: string;
  state?: string;
  token: string;
};

export type CreateGroupBody = {
  image?: string;
  name: string;
};

export type CreateGroupResponse = {
  createdAt: string;
  id: number;
  image: string | null;
  name: string;
  updatedAt: string;
};

export type AcceptGroupInvitationBody = {
  token: string;
  userEmail: string;
};

export type AcceptGroupInvitationResponse = {
  groupId: number;
};

export type SendResetPasswordEmailBody = {
  email: string;
  redirectUrl: string;
};

export type ResetPasswordBody = {
  password: string;
  passwordConfirmation: string;
  token: string;
};

export type ArticleBody = {
  content: string;
  image?: string | null;
  title: string;
};

export type CommentBody = {
  content: string;
};

export type TaskUpdateBody = {
  description?: string;
  done?: boolean;
  name?: string;
};

export type RecurringBody = QueryParams;

export type UploadImageResponse = {
  url: string;
};

export type RefetchQueryKeysParams = {
  queryClient: QueryClient;
  queryKeysToRefetch: readonly QueryKey[];
};

export type UserInfo = {
  id: number;
  nickname: string;
  email: string;
  image: string | null;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  memberships: MembershipInfo[];
};

export type MembershipInfo = {
  userId: number;
  groupId: number;
  userName: string;
  userEmail: string;
  userImage: string | null;
  role: 'ADMIN' | 'MEMBER';
  group: {
    id: number;
    name: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    teamId: string;
  };
};
