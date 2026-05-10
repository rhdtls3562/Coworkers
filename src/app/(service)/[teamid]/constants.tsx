import type { MemberChipsProps } from '@/app/(service)/[teamid]/types';
import { IcMoreVerticalGray, IcSettingsLarge } from '@/assets/index';

export const TEAM_MEMBERS: MemberChipsProps[] = [];

export const STATUS = ['시작 전', '진행 중', '완료'] as const;

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
