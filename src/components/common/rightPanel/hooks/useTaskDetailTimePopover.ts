/**
 * 오른쪽 패널 일정 수정 폼에서 시간 선택 팝오버 상태를 관리하는 훅입니다.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseTaskDetailTimePopoverReturn = {
  closeTimePopover: () => void;
  isTimePopoverOpen: boolean;
  timePopoverContainerRef: React.RefObject<HTMLDivElement | null>;
  toggleTimePopover: () => void;
};

export default function useTaskDetailTimePopover(): UseTaskDetailTimePopoverReturn {
  const timePopoverContainerRef = useRef<HTMLDivElement>(null);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  const closeTimePopover = useCallback(() => {
    setIsTimePopoverOpen(false);
  }, []);

  const toggleTimePopover = useCallback(() => {
    setIsTimePopoverOpen((previousValue) => !previousValue);
  }, []);

  useEffect(() => {
    if (!isTimePopoverOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        timePopoverContainerRef.current &&
        !timePopoverContainerRef.current.contains(event.target as Node)
      ) {
        setIsTimePopoverOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isTimePopoverOpen]);

  return {
    closeTimePopover,
    isTimePopoverOpen,
    timePopoverContainerRef,
    toggleTimePopover,
  };
}
