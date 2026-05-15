/**
 * 오른쪽 패널 일정 수정 폼에서 시간 선택 팝오버 상태를 관리하는 훅입니다.
 */

'use client';

import { useCallback, useRef, useState } from 'react';

import useClickOutside from '@/hooks/useClickOutside';

type UseTaskDetailTimePopoverReturn = {
  closeTimePopover: () => void;
  isTimePopoverOpen: boolean;
  timePopoverButtonRef: React.RefObject<HTMLButtonElement | null>;
  timePopoverContainerRef: React.RefObject<HTMLDivElement | null>;
  toggleTimePopover: () => void;
};

export default function useTaskDetailTimePopover(): UseTaskDetailTimePopoverReturn {
  const timePopoverContainerRef = useRef<HTMLDivElement>(null);
  const timePopoverButtonRef = useRef<HTMLButtonElement>(null);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  const closeTimePopover = useCallback(() => {
    setIsTimePopoverOpen(false);
  }, []);

  const toggleTimePopover = useCallback(() => {
    setIsTimePopoverOpen((previousValue) => !previousValue);
  }, []);

  useClickOutside({
    onClickOutside: closeTimePopover,
    refs: [timePopoverContainerRef, timePopoverButtonRef],
  });

  return {
    closeTimePopover,
    isTimePopoverOpen,
    timePopoverButtonRef,
    timePopoverContainerRef,
    toggleTimePopover,
  };
}
