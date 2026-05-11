import type { ListDropdownItem } from '@/components/common/dropdown/types';

export type PageHeaderProps = {
  className?: string;
  hasSettingsButton?: boolean;
  settingsItems?: ListDropdownItem[];
  title: string;
};
