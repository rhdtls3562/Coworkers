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

    requestAnimationFrame(() => {
      timePopoverContainerRef.current?.focus();
    });

    const isInsidePopover = (target: EventTarget | null) =>
      target instanceof Node &&
      timePopoverContainerRef.current?.contains(target);

    const handleMouseDown = (event: MouseEvent) => {
      if (isInsidePopover(event.target)) return;
      setIsTimePopoverOpen(false);
    };

    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndY = event.changedTouches[0]?.clientY ?? 0;
      if (Math.abs(touchEndY - touchStartY) > 10) return;
      if (isInsidePopover(event.target)) return;
      setIsTimePopoverOpen(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTimePopoverOpen]);

  return {
    closeTimePopover,
    isTimePopoverOpen,
    timePopoverContainerRef,
    toggleTimePopover,
  };
}
