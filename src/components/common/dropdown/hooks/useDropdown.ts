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

type UseDropdownOptions = {
  /** true이면 바깥 클릭·터치로 닫히지 않고 명시적 close 호출로만 닫힙니다. */
  disableOutsideClose?: boolean;
};

export function useDropdown(
  ignoreRefs: React.RefObject<HTMLElement | null>[] = [],
  { disableOutsideClose = false }: UseDropdownOptions = {},
): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (disableOutsideClose) return;

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
  }, [isOpen, close, ignoreRefs, disableOutsideClose]);

  return { isOpen, toggle, close, containerRef };
}
