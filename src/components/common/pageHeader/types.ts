/** 페이지 헤더 컴포넌트 TypeScript 타입 정의 파일입니다. */

import type { ListDropdownItem } from '@/components/common/dropdown/types';

export type PageHeaderProps = {
  className?: string;
  hasSettingsButton?: boolean;
  settingsItems?: ListDropdownItem[];
  title: string;
};
