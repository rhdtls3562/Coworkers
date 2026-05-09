import type { ReactNode } from 'react';

export type TaskProps = {
  status: '시작 전' | '진행 중' | '완료';
  taskLists: TaskList[];
};
export type TaskItemProps = {
  title: string;
  status: string;
  tasks: TaskItemDetailProps[];
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

export type ModalMemberProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
  member: MemberChipsProps | null;
  onMemberClick?: (member: MemberChipsProps) => void;
};
export type ModalMembersProps = {
  onClose: () => void;
  onPrimaryButtonClick?: () => void;
  onMemberClick?: (member: MemberChipsProps) => void;
  members: MemberChipsProps[];
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

export type TeamPageProps = {
  params: Promise<{ teamid: string }>;
};

export type TeamMemberListContentProps = {
  members: MemberChipsProps[];
  onMemberClick: (member: MemberChipsProps) => void;
};

export type TeamProgressStatsProps = {
  today: number;
  done: number;
};

export type TeamProgressModalProps = {
  is: (key: ModalKey) => boolean;
  close: () => void;
  open: (key: ModalKey) => void;
  reset: () => void;
  selectedMember: MemberChipsProps | null;
  openMemberDetail: (member: MemberChipsProps) => void;
  members: MemberChipsProps[];
};

export type OpenModal = (modal: ModalKey) => void;

export type GroupType = {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
};

export type RoleProps = 'ADMIN' | 'MEMBER';
export type TaskList = {
  id: number;
  name: string;
  tasks: TaskItemDetailProps[];
};
export type TeamDetailData = GroupType & {
  members: MemberChipsProps[];
  taskLists: TaskList[];
};
export type TeamProgressProps = {
  role?: RoleProps;
  teamData: TeamDetailData | undefined;
};

export type TeamMemberProps = {
  teamData: TeamDetailData;
};

export type Writer = {
  id: number;
  nickname: string;
  image: string;
};

export type Frequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

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
  doneBy: {
    user: Writer | null;
  };
  commentCount: number;
  frequency: Frequency;
};

export type TaskItemPropsExtended = TaskItemProps & {
  taskListId: number;
};
