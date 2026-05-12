import type {
  MemberChipsProps,
  OpenModal,
} from '@/app/(service)/[teamid]/types';
import { IcMoreVerticalGray, IcSettingsLarge } from '@/assets/index';

export const TEAM_MEMBERS: MemberChipsProps[] = [];

export const STATUS = ['시작 전', '진행 중', '완료'] as const;

export const ROLE = ['ADMIN', 'MEMBER'] as const;

export const MODAL_TYPE = [
  'memberList',
  'memberInvite',
  'memberDetail',
  'memberDelete',
  'taskAdd',
  'taskEdit',
  'taskDelete',
  'teamDelete',
  'teamLeave',
] as const;

export const EMPTY_MESSAGE: Record<(typeof STATUS)[number], string> = {
  '시작 전': '아직 등록된 할 일이 없어요.',
  '진행 중': '아직 진행 중인 할 일이 없어요.',
  완료: '아직 완료된 할 일이 없습니다.',
} as const;

export const SETTING_BUTTON = (
  <IcSettingsLarge width="24" height="24" role="img" aria-label="설정 아이콘" />
);

export const DROPDOWN_BUTTON = (
  <IcMoreVerticalGray
    width="24"
    height="24"
    role="img"
    aria-label="드롭다운 버튼"
  />
);

export const CREATE_MASTER_ITEMS = (
  teamid: string,
  push: (path: string) => void, // router.push
  open: OpenModal,
) => [
  { label: '수정하기', onClick: () => push(`/${teamid}/edit`) },
  { label: '삭제하기', onClick: () => open('teamDelete') },
];

export const CREATE_MEMBER_ITEMS = (open: OpenModal) => [
  { label: '팀 나가기', onClick: () => open('teamLeave') },
];
