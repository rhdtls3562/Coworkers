/** 배지 컴포넌트의 상태에 따른 스타일 계산 유틸 함수 파일입니다. */

import { BADGE_STATUS } from '@/components/common/badge/constants';
import type { BadgeProps, BadgeStatus } from '@/components/common/badge/types';

export const getStatus = ({
  completed,
  total,
}: Pick<BadgeProps, 'completed' | 'total'>): BadgeStatus => {
  if (total <= 0 || completed <= 0) return BADGE_STATUS.START;
  if (completed >= total) return BADGE_STATUS.DONE;
  return BADGE_STATUS.ONGOING;
};

export const getPercentage = ({
  completed,
  total,
}: Pick<BadgeProps, 'completed' | 'total'>): number => {
  return total > 0 ? Math.max(0, Math.min(100, (completed / total) * 100)) : 0;
};
