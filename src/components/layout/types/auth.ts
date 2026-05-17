/** 레이아웃 인증 상태 관련 TypeScript 타입 정의 파일입니다. */

import type { LayoutCurrentUser } from '@/components/layout/constants';
import type { SidebarTeam } from '@/components/layout/sidebar/types';

export type LayoutMembershipGroup = {
  createdAt?: string;
  id?: number | string;
  name?: string;
  teamId?: string;
};

export type LayoutMembership = {
  group?: LayoutMembershipGroup;
  role?: string;
};

export type LayoutMeResponse = {
  email?: string;
  image?: string | null;
  nickname?: string;
};

export type LayoutSessionFallbackUser = {
  email?: string;
  image?: string | null;
  nickname?: string;
  teamName?: string;
};

export type LayoutAuthState = {
  currentUser: LayoutCurrentUser;
  isAuthenticated: boolean;
  profileTeamName?: string;
  teams: SidebarTeam[];
};
