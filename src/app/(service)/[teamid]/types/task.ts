// ========================
// 태스크 관련 타입
// ========================

import type { Frequency, Writer } from '@/app/(service)/[teamid]/types';

/** 태스크 상세 항목 - API 응답 기반의 태스크 전체 데이터 */
export type TaskItemDetailProps = {
  id: number;
  name: string;
  description: string;
  date: string;
  doneAt: string | null;
  updatedAt: string;
  user: Writer | null;
  recurringId: number;
  deletedAt: string | null;
  displayIndex: number;
  writer: Writer;
  doneBy: { user: Writer | null };
  commentCount: number;
  frequency: Frequency;
};

/** 태스크 리스트 - 태스크 묶음 단위 */
export type TaskList = {
  id: number;
  name: string;
  tasks: TaskItemDetailProps[];
};

/** 태스크 컴포넌트 Props - 상태 필터 + 태스크 리스트 목록 */
export type TaskProps = {
  status: '시작 전' | '진행 중' | '완료';
  taskLists: TaskList[];
};

/** 태스크 아이템 컴포넌트 Props - 개별 태스크 리스트 행 */
export type TaskItemProps = {
  title: string;
  status: string;
  tasks: TaskItemDetailProps[];
};

/** 태스크 아이템 확장 Props - taskListId 포함 버전 */
export type TaskItemPropsExtended = TaskItemProps & {
  taskListId: number;
};
