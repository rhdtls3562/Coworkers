/**
 * 화살표 없이 리스트 항목만 띄워주는 메뉴형 드롭다운 컴포넌트입니다.
 * 메뉴는 트리거 오른쪽과 맞추고 아래로 열립니다.
 */

'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { useDropdown } from '@/components/common/dropdown/hooks/useDropdown';
import type { ListDropdownProps } from '@/components/common/dropdown/types';
import { cn } from '@/utils/cn';

export default function ListDropdown({
  trigger,
  items,
  className,
  itemClassName,
  menuClassName,
  itemTextAlign = 'center',
  horizontalAlign = 'end',
  verticalPosition = 'bottom',
}: ListDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const { isOpen, toggle, close, containerRef } = useDropdown([menuRef]);
  const animationFrameRef = useRef<number | null>(null);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = menuRect.width || 120;
    const menuHeight = menuRect.height || 0;
    const isTriggerOutOfViewport =
      triggerRect.bottom <= 8 ||
      triggerRect.top >= viewportHeight - 8 ||
      triggerRect.right <= 8 ||
      triggerRect.left >= viewportWidth - 8;

    if (isTriggerOutOfViewport) {
      close();
      return;
    }

    const alignedLeft =
      horizontalAlign === 'start'
        ? triggerRect.left
        : triggerRect.right - menuWidth;
    const preferredTop =
      verticalPosition === 'top'
        ? triggerRect.top - menuHeight - 8
        : triggerRect.bottom + 8;
    const fallbackTop =
      verticalPosition === 'top'
        ? triggerRect.bottom + 8
        : triggerRect.top - menuHeight - 8;
    const canUsePreferredTop =
      verticalPosition === 'top'
        ? preferredTop >= 8
        : preferredTop + menuHeight <= viewportHeight - 8;
    const nextTop = canUsePreferredTop ? preferredTop : fallbackTop;

    setMenuPosition({
      top: Math.min(
        Math.max(8, nextTop),
        Math.max(8, viewportHeight - menuHeight - 8),
      ),
      left: Math.min(
        Math.max(8, alignedLeft),
        Math.max(8, viewportWidth - menuWidth - 8),
      ),
    });
  }, [close, horizontalAlign, verticalPosition]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const scheduleUpdateMenuPosition = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        updateMenuPosition();
      });
    };

    updateMenuPosition();
    scheduleUpdateMenuPosition();

    window.addEventListener('scroll', scheduleUpdateMenuPosition, true);
    window.addEventListener('resize', scheduleUpdateMenuPosition);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener('scroll', scheduleUpdateMenuPosition, true);
      window.removeEventListener('resize', scheduleUpdateMenuPosition);
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex items-center', className)}
    >
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        className="inline-flex items-center"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        }}
      >
        {trigger}
      </div>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            className={cn(
              'fixed z-70! flex w-30 flex-col overflow-hidden rounded-xl border border-border-secondary bg-background-primary p-0 shadow-lg',
              menuClassName,
            )}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            role="menu"
          >
            {items.map((item, index) => (
              <li key={`${index}-${item.label}`} role="none" className="w-full">
                <button
                  type="button"
                  role="menuitem"
                  className={cn(
                    'w-full whitespace-nowrap px-6 py-3 text-sm text-text-primary hover:bg-background-secondary active:bg-background-secondary',
                    itemTextAlign === 'start' ? 'text-start' : 'text-center',
                    itemClassName,
                  )}
                  onClick={() => {
                    item.onClick();
                    close();
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
