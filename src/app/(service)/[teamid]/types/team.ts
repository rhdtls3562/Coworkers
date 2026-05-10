// ========================
// 팀 / 그룹 관련 타입
// ========================

import type { ModalKey, RoleProps } from './common';
import type { MemberChipsProps } from './member';
import type { TaskList } from './task';

/** 그룹 기본 정보 - API 응답 기반 */
export type GroupType = {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
};

/** 팀 상세 데이터 - 그룹 정보 + 멤버 목록 + 태스크 리스트 */
export type TeamDetailData = GroupType & {
  members: MemberChipsProps[];
  taskLists: TaskList[];
};

/** 팀 페이지 Props - Next.js 동적 라우트 파라미터 */
export type TeamPageProps = {
  params: Promise<{ teamid: string }>;
};

/** 팀 진행률 통계 Props - 오늘 할 일 수 / 완료 수 */
export type TeamProgressStatsProps = {
  today: number;
  done: number;
};

/** 팀 진행률 섹션 Props */
export type TeamProgressProps = {
  role?: RoleProps;
  teamData: TeamDetailData | undefined;
};

/** 팀 멤버 섹션 Props */
export type TeamMemberProps = {
  teamData: TeamDetailData;
};

/** 팀 멤버 목록 컨텐츠 Props */
export type TeamMemberListContentProps = {
  members: MemberChipsProps[];
  onMemberClick: (member: MemberChipsProps) => void;
};

/** 팀 진행률 모달 통합 Props - 모달 상태 제어 + 멤버 관련 상태 */
export type TeamProgressModalProps = {
  is: (key: ModalKey) => boolean;
  close: () => void;
  open: (key: ModalKey) => void;
  reset: () => void;
  selectedMember: MemberChipsProps | null;
  openMemberDetail: (member: MemberChipsProps) => void;
  members: MemberChipsProps[];
};
