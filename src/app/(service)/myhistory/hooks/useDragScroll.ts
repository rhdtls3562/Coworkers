/**
 * 가로 스크롤 영역을 포인터 드래그로 이동할 수 있게 하는 훅입니다.
 */

import { useRef } from 'react';

import { HISTORY_FILTER_TABS_DRAG_THRESHOLD } from '@/app/(service)/myhistory/constants';
import type { UseDragScrollReturn } from '@/app/(service)/myhistory/types';

export default function useDragScroll(): UseDragScrollReturn {
  const containerRef = useRef<HTMLUListElement>(null);
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);

  const releasePointerCapture = (target: HTMLElement) => {
    const pointerId = activePointerIdRef.current;

    if (pointerId === null || !target.hasPointerCapture(pointerId)) {
      activePointerIdRef.current = null;
      return;
    }

    target.releasePointerCapture(pointerId);
    activePointerIdRef.current = null;
  };

  const resetDragState = () => {
    isPointerDownRef.current = false;

    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    window.requestAnimationFrame(() => {
      hasDraggedRef.current = false;
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (
      (event.pointerType === 'mouse' && event.button !== 0) ||
      !containerRef.current
    ) {
      return;
    }

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    hasDraggedRef.current = false;
    startXRef.current = event.clientX;
    startScrollLeftRef.current = containerRef.current.scrollLeft;
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
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

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    releasePointerCapture(event.currentTarget);
    resetDragState();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLElement>) => {
    releasePointerCapture(event.currentTarget);
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    hasDraggedRef.current = false;
  };

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
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
