/**
 * 할 일 보드 달력 팝오버 열림·닫힘 및 바깥 클릭 처리입니다.
 */

import { useEffect, useRef, useState } from 'react';

export default function useTaskListCalendarPopover() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        (calendarRef.current?.contains(event.target) ||
          calendarButtonRef.current?.contains(event.target))
      ) {
        return;
      }

      setIsCalendarOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      setIsCalendarOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarOpen]);

  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  return {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  };
}
