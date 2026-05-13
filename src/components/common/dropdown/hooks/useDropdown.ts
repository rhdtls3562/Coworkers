/**
 * 드롭다운 열림/닫힘 상태와 바깥 클릭 감지를 관리하는 커스텀 훅입니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type UseDropdownReturn = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export function useDropdown(
  ignoreRefs: React.RefObject<HTMLElement | null>[] = [],
): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (isOpen) {
      document.addEventListener('pointerdown', handleOutsidePointerDown);
      document.addEventListener('keydown', handleEscapeKeyDown);
    }

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
      document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isOpen, close, ignoreRefs]);

  return { isOpen, toggle, close, containerRef };
}
