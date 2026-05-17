/** 레이아웃 컴포넌트 TypeScript 타입 정의 파일입니다. */

import type { RefObject } from 'react';

import type { RightPanelContent } from '@/components/common/rightPanel';

export type ServiceLayoutContextValue = {
  closeRightPanel: () => void;
  handleSidebarInteraction: () => void;
  isMobileSidebarRendered: boolean;
  isMobileSidebarVisible: boolean;
  isRightPanelRendered: boolean;
  isRightPanelVisible: boolean;
  isSidebarExpanded: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  openRightPanel: (content: RightPanelContent) => void;
  rightPanelContent: RightPanelContent | null;
  toggleMobileSidebar: () => void;
  toggleSidebar: () => void;
};
