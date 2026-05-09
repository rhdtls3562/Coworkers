import type { ReactNode } from 'react';

export type TaskProps = {
  status: '시작 전' | '진행 중' | '완료';
};
export type TaskItemProps = {
  title: string;
  status: string;
};

export type MemberCardProps = {
  name: string;
  email: string;
  userImage: string;
  onClick: () => void;
};

export type MemberChipsProps = {
  role: string;
  userImage: string;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
};

export type ModalKey =
  | 'memberList'
  | 'memberInvite'
  | 'memberDetail'
  | 'memberDelete'
  | 'taskAdd'
  | 'taskEdit'
  | 'taskDelete'
  | 'teamDelete'
  | 'teamLeave';

export type ModalMembersProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
  member?: MemberChipsProps | null;
  onMemberClick?: (member: MemberChipsProps) => void;
};
export type ModalTaskProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
};

export type ConfirmModalProps = {
  title?: string;
  description?: string;
  confirmText: string;
  toastMessage: string;
  onClose: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
};

export type TeamMemberListContentProps = {
  members: MemberChipsProps[];
  onMemberClick: (member: MemberChipsProps) => void;
};

export type TaskListBoardProps = {
  columnTitle: string;
  className?: string;
  groupId: number | null;
  taskListId: string;
};

export type TeamProgressModalProps = {
  is: (key: ModalKey) => boolean;
  close: () => void;
  open: (key: ModalKey) => void;
  selectedMember: MemberChipsProps | null;
  openMemberDetail: (member: MemberChipsProps) => void;
};
