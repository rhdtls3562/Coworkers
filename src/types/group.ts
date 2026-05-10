/**
 * 팀, 그룹, 멤버 관련 TypeScript 타입을 정의하는 파일입니다.
 */

import type { TaskListSummary } from '@/types/task';

/** 사용자 간략 정보 */
export type UserSummary = {
  id: number;
  nickname: string;
  image: string | null;
};

/** 그룹 멤버 */
export type GroupMember = {
  role: 'ADMIN' | 'MEMBER';
  userImage: string | null;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
};

/** 내 그룹 목록 아이템 */
export type GroupSummary = {
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string | null;
  name: string;
  id: number;
};

/** 그룹 상세 */
export type GroupDetail = {
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string | null;
  name: string;
  id: number;
  members: GroupMember[];
  taskLists: TaskListSummary[];
};
