/**
 * 할 일 만들기 모달을 여는 플로팅 액션 버튼입니다.
 */

import type { TaskListFABProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcPlusLarge } from '@/assets';
import { FloatingButton } from '@/components/common/button';
import { cn } from '@/utils/cn';

export default function TaskListFAB({ onClick, className }: TaskListFABProps) {
  return (
    <FloatingButton
      onClick={onClick}
      type="button"
      aria-label="할 일 만들기"
      className={cn(
        'bottom-24 right-6 z-40 md:bottom-28 md:right-10',
        className,
      )}
      buttonClassName="size-14 md:size-16"
    >
      <IcPlusLarge
        width={28}
        height={28}
        className="size-7 brightness-0 invert md:size-8"
        aria-hidden="true"
      />
    </FloatingButton>
  );
}
