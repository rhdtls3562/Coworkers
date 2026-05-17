/** 팀 페이지 유저·멤버 관련 타입 정의 파일입니다. */

// ========================
// 유저 / 멤버 관련 타입
// ========================

import { RoleProps } from '@/app/types';

/** 태스크 작성자 정보 */
export type Writer = {
  id: number;
  nickname: string;
  image: string;
};

/** 멤버 카드 컴포넌트 Props - 멤버 목록에서 개별 카드 UI */
export type MemberCardProps = {
  name: string;
  email: string;
  userImage: string;
  onClick: () => void;
};

/** 멤버 칩(태그) 컴포넌트 Props - 멤버를 칩 형태로 표시할 때 사용 */
export type MemberChipsProps = {
  role: RoleProps;
  userImage: string;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
};

/** 단일 멤버 모달 Props */
export type ModalMemberProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
  canDeleteMember?: boolean;
  member: MemberChipsProps | null;
  onMemberClick?: (member: MemberChipsProps) => void;
  role?: RoleProps;
};

/** 멤버 목록 모달 Props */
export type ModalMembersProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
  onMemberClick?: (member: MemberChipsProps) => void;
  members: MemberChipsProps[];
};
