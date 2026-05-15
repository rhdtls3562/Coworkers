/**
 * 할 일 보드 달력 팝오버 열림·닫힘 및 바깥 클릭 처리입니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export default function useTaskListCalendarPopover() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCalendarOpen) return;

    // 열릴 때 포커스 이동
    requestAnimationFrame(() => {
      calendarRef.current?.focus();
    });

    const isInsidePopover = (target: EventTarget | null) =>
      target instanceof Node &&
      (calendarRef.current?.contains(target) ||
        calendarButtonRef.current?.contains(target));

    const handleMouseDown = (event: MouseEvent) => {
      if (isInsidePopover(event.target)) return;
      setIsCalendarOpen(false);
    };

    // touchend를 사용하면 스크롤 중 터치는 무시됨
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndY = event.changedTouches[0]?.clientY ?? 0;
      const isScroll = Math.abs(touchEndY - touchStartY) > 10;

      if (isScroll) return;
      if (isInsidePopover(event.target)) return;

      setIsCalendarOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsCalendarOpen(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarOpen]);

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false);
  }, []);

  const toggleCalendar = useCallback(() => {
    setIsCalendarOpen((prev) => !prev);
  }, []);

  return {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  };
}
