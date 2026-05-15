/**
 * 여러 DOM 요소 외부를 클릭할 때 콜백을 실행하는 훅입니다.
 * 스크롤 제스처와 일반 클릭을 구분하여 모바일 환경을 지원합니다.
 *
 * @example
 * const popoverRef = useRef<HTMLDivElement>(null);
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useClickOutside(() => setIsOpen(false), [popoverRef, buttonRef], true);
 */

import { useEffect } from 'react';

type UseClickOutsideProps = {
  /** 외부 클릭 시 실행할 콜백 */
  onClickOutside: () => void;
  /** 제외할 DOM 요소의 ref 배열 */
  refs: Array<React.RefObject<HTMLElement | null>>;
  /** 스크롤 제스처 감지 활성화 */
  detectScroll?: boolean;
};

/**
 * 스크롤 감지 기준값 (픽셀)
 * 이 값 이상 움직임이 있으면 스크롤로 판단
 */
const SCROLL_THRESHOLD = 10;

export default function useClickOutside({
  onClickOutside,
  refs,
  detectScroll = false,
}: UseClickOutsideProps) {
  useEffect(() => {
    const isInsideAnyRef = (target: EventTarget | null) =>
      target instanceof Node &&
      refs.some((ref) => ref.current?.contains(target));

    const handleMouseDown = (event: MouseEvent) => {
      if (isInsideAnyRef(event.target)) return;
      onClickOutside();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleEscape);

    // 스크롤 감지 로직
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!detectScroll) return;

      const touchEndY = event.changedTouches[0]?.clientY ?? 0;
      const isScroll = Math.abs(touchEndY - touchStartY) > SCROLL_THRESHOLD;

      if (isScroll) return;
      if (isInsideAnyRef(event.target)) return;

      onClickOutside();
    };

    if (detectScroll) {
      document.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleEscape);
      if (detectScroll) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [onClickOutside, refs, detectScroll]);
}
