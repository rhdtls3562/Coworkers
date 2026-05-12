/**
 * 할 일과 할 일 목록 관련 TypeScript 타입을 정의하는 파일입니다.
 */

import type { UserSummary } from '@/types/group';

/** 할 일 */
export type Task = {
  id: number;
  name: string;
  description: string | null;
  date: string;
  doneAt: string | null;
  updatedAt: string;
  deletedAt: string | null;
  displayIndex: number;
  commentCount: number;
  recurringId: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE';
  weekDays?: number[];
  writer: UserSummary;
  doneBy: { user: UserSummary } | null;
};

/** 할 일 목록 요약 — 그룹 상세 응답 내 */
export type TaskListSummary = {
  id: number;
  name: string;
  displayIndex: number;
  groupId: number;
  updatedAt: string;
  createdAt: string;
  tasks: Task[];
};

/** 할 일 목록 상세 — task-list 단건 조회 응답 */
export type TaskListDetail = {
  id: number;
  name: string;
  displayIndex: number;
  groupId: number;
  updatedAt: string;
  createdAt: string;
  tasks: Task[];
};

/** 댓글 */
export type Comment = {
  id: number;
  content: string;
  userId: number;
  taskId: number;
  createdAt: string;
  updatedAt: string;
  user: UserSummary;
};
