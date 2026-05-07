/**
 * 내 히스토리 달력 팝오버의 열림 상태와 외부 클릭 닫힘을 관리하는 훅입니다.
 */

import { useEffect, useRef, useState } from 'react';

export default function useHistoryCalendarPopover() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
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
