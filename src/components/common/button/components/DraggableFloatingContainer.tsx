/**
 * 플로팅 버튼을 드래그 가능한 컨테이너로 감싸는 컴포넌트입니다.
 */

'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

import Draggable from 'react-draggable';

import { cn } from '@/utils/cn';

import type { DraggableData, DraggableEvent } from 'react-draggable';

type DraggableFloatingContainerProps = {
  children: ReactNode;
  className?: string;
  dragBounds?: 'body' | string;
};

const DRAG_THRESHOLD = 6;

export default function DraggableFloatingContainer({
  children,
  className,
  dragBounds = 'body',
}: DraggableFloatingContainerProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const hasDragged = useRef(false);
  const dragDistanceRef = useRef(0);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const handleTouchStart = () => {
    setIsTouchDevice(true);
    setShowTooltip(true);
    tooltipTimer.current = setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handleTouchEnd = () => {
    clearTimeout(tooltipTimer.current ?? undefined);
  };

  const handleTouchCancel = () => {
    clearTimeout(tooltipTimer.current ?? undefined);
  };

  const handleStart = () => {
    hasDragged.current = false;
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    dragDistanceRef.current += Math.abs(data.deltaX) + Math.abs(data.deltaY);

    if (dragDistanceRef.current >= DRAG_THRESHOLD) {
      hasDragged.current = true;
      setShowTooltip(false);
    }
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  const containerClassName = cn(
    'relative select-none touch-none cursor-grab active:cursor-grabbing',
    className,
  );

  return (
    <Draggable
      allowMobileScroll
      bounds={dragBounds}
      nodeRef={nodeRef}
      onStart={handleStart}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className={containerClassName}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onClickCapture={(e) => {
          if (hasDragged.current) {
            e.stopPropagation();
            hasDragged.current = false;
          }
        }}
      >
        {showTooltip && (isTouchDevice ? true : !isDragging) && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-md">
            움직여 보세요!
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
          </div>
        )}

        {children}
      </div>
    </Draggable>
  );
}
