/**
 * 할 일 보드 달력 팝오버 열림·닫힘 및 바깥 클릭 처리입니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import useClickOutside from '@/hooks/useClickOutside';

export default function useTaskListCalendarPopover() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarButtonRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false);
  }, []);

  useClickOutside({
    onClickOutside: closeCalendar,
    refs: [calendarRef, calendarButtonRef],
    detectScroll: true,
  });

  // 열릴 때 포커스 이동 (calendarRef 요소에 tabIndex={-1} 필요)
  useEffect(() => {
    if (!isCalendarOpen) return;
    requestAnimationFrame(() => {
      calendarRef.current?.focus();
    });
  }, [isCalendarOpen]);

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
