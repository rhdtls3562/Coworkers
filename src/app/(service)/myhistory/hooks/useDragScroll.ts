/**
 * 가로 스크롤 영역을 마우스로 드래그할 수 있게 하는 훅입니다.
 * 터치 환경에서는 브라우저 기본 가로 스크롤을 그대로 사용합니다.
 */

import { useEffect, useRef } from 'react';

import { HISTORY_FILTER_TABS_DRAG_THRESHOLD } from '@/app/(service)/myhistory/constants';
import type { UseDragScrollReturn } from '@/app/(service)/myhistory/types';

export default function useDragScroll(): UseDragScrollReturn {
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

    if (Math.abs(movedX) <= HISTORY_FILTER_TABS_DRAG_THRESHOLD) {
      return;
    }

    isDraggingRef.current = true;
    hasDraggedRef.current = true;
    containerRef.current.scrollLeft = startScrollLeftRef.current - movedX;
    event.preventDefault();
  };

  useEffect(() => {
    const handlePointerEnd = () => {
      isPointerDownRef.current = false;

      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;
      window.requestAnimationFrame(() => {
        hasDraggedRef.current = false;
      });
    };

    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);

    return () => {
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
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
