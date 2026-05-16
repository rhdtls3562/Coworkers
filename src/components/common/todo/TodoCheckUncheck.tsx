'use client';

/**
 * 할 일 항목의 체크 상태를 표시하는 공용 컴포넌트입니다.
 */

import { useCallback, useRef } from 'react';

import IcCheckboxCheckedLarge from '@/assets/icons/ic_checkbox_checked_large.svg';
import IcCheckboxLarge from '@/assets/icons/ic_checkbox_large.svg';

/**
 * 터치 이동 임계값(px): 이 값을 초과하면 스크롤로 판단해 토글을 건너뜁니다.
 */
const SCROLL_MOVE_THRESHOLD = 10;

type TodoCheckUncheckProps = {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export default function TodoCheckUncheck({
  label,
  checked,
  onChange,
}: TodoCheckUncheckProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLLabelElement>) => {
      if (!onChange) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [onChange],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLLabelElement>) => {
      if (!onChange) return;

      const touch = e.changedTouches[0];
      const start = touchStartRef.current;
      touchStartRef.current = null;

      // 스크롤 동작 감지: 이동 거리가 임계값을 초과하면 토글하지 않음
      if (start) {
        const dx = Math.abs(touch.clientX - start.x);
        const dy = Math.abs(touch.clientY - start.y);
        if (dx > SCROLL_MOVE_THRESHOLD || dy > SCROLL_MOVE_THRESHOLD) {
          return;
        }
      }

      // 모바일 ghost click 방지:
      // touchend 이후 ~300ms 뒤 브라우저가 합성하는 click 이벤트를 차단하고
      // onChange를 직접 한 번만 호출한다.
      e.preventDefault();
      onChange(!checked);
    },
    [checked, onChange],
  );

  return (
    <label
      className="flex min-w-0 cursor-pointer items-center gap-2 md:gap-2.5"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
        readOnly={!onChange}
        className="sr-only"
      />

      {checked ? (
        <IcCheckboxCheckedLarge
          width={16}
          height={16}
          className="h-3 w-3 shrink-0 md:h-4 md:w-4"
          aria-hidden="true"
        />
      ) : (
        <IcCheckboxLarge
          width={16}
          height={16}
          className="h-3 w-3 shrink-0 md:h-4 md:w-4"
          aria-hidden="true"
        />
      )}

      <span
        className={`min-w-0 truncate text-sm font-medium leading-none md:text-base ${
          checked
            ? 'text-interaction-inactive line-through'
            : 'text-text-primary'
        }`}
      >
        {label}
      </span>
    </label>
  );
}
