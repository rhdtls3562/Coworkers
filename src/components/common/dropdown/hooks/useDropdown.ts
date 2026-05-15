/**
 * 드롭다운 열림/닫힘 상태와 바깥 클릭 감지를 관리하는 커스텀 훅입니다.
 * 모바일 스크롤 제스처와 일반 클릭을 구분하여 처리합니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type UseDropdownReturn = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

/** 스크롤 감지 기준값 (픽셀) */
const SCROLL_THRESHOLD = 10;

export function useDropdown(
  ignoreRefs: React.RefObject<HTMLElement | null>[] = [],
): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef(0);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideIgnoredElement = ignoreRefs.some((ref) =>
        ref.current?.contains(target),
      );

      if (!isInsideContainer && !isInsideIgnoredElement) {
        close();
      }
    };

    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndY = event.changedTouches[0]?.clientY ?? 0;
      const isScroll =
        Math.abs(touchEndY - touchStartYRef.current) > SCROLL_THRESHOLD;

      if (isScroll) return;

      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsideIgnoredElement = ignoreRefs.some((ref) =>
        ref.current?.contains(target),
      );

      if (!isInsideContainer && !isInsideIgnoredElement) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleOutsidePointerDown);
      document.addEventListener('keydown', handleEscapeKeyDown);
      document.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
      document.removeEventListener('keydown', handleEscapeKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, close, ignoreRefs]);

  return { isOpen, toggle, close, containerRef };
}
