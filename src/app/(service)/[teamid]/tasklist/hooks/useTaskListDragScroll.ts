'use client';

/**
 * 가로 스크롤 영역을 마우스로 드래그할 수 있게 하는 훅입니다.
 * 마이히스토리 `useDragScroll`과 동일한 구현(tasklist 전용).
 */

import { useEffect, useRef } from 'react';

type UseTaskListDragScrollReturn = {
  containerRef: React.RefObject<HTMLUListElement | null>;
  handleClickCapture: (event: React.MouseEvent<HTMLElement>) => void;
  handlePointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  handlePointerMove: (event: React.PointerEvent<HTMLElement>) => void;
};

const DRAG_THRESHOLD = 8;

export default function useTaskListDragScroll(): UseTaskListDragScrollReturn {
  const containerRef = useRef<HTMLUListElement>(null);
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    hasDraggedRef.current = false;
    startXRef.current = event.clientX;
    startScrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDownRef.current || !containerRef.current) {
      return;
    }

    const movedX = event.clientX - startXRef.current;

    if (Math.abs(movedX) <= DRAG_THRESHOLD) {
      return;
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = true;
    containerRef.current.scrollLeft = startScrollLeftRef.current - movedX;
    event.preventDefault();
  };

  useEffect(() => {
    const handlePointerUp = () => {
      isPointerDownRef.current = false;

      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;
      window.requestAnimationFrame(() => {
        hasDraggedRef.current = false;
      });
    };

    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handleClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    if (!hasDraggedRef.current) {
      return;
    }

    isDraggingRef.current = false;
    event.preventDefault();
    event.stopPropagation();
    hasDraggedRef.current = false;
  };

  return {
    containerRef,
    handleClickCapture,
    handlePointerDown,
    handlePointerMove,
  };
}
