/** 랜딩 페이지에서 사용하는 상수 정의 파일입니다. */

import type {
  LandingRevealDelay,
  LandingRevealDirection,
  LandingSectionContent,
  LandingTaskColumnImage,
} from '@/app/(landing)/types';
import {
  imgLandingTaskColumnDone,
  imgLandingTaskColumnProgress,
  imgLandingTaskColumnTodo,
  imgLandingTaskDetail,
  imgLandingTasklist,
} from '@/assets';

export const LANDING_TASK_COLUMN_IMAGES = [
  {
    alt: '할 일 목록 예시',
    image: imgLandingTaskColumnTodo,
  },
  {
    alt: '진행 중 목록 예시',
    image: imgLandingTaskColumnProgress,
  },
  {
    alt: '완료 목록 예시',
    image: imgLandingTaskColumnDone,
  },
] as const satisfies readonly LandingTaskColumnImage[];

export const LANDING_TASK_COLUMN_SECTION = {
  description:
    '팀원과 함께 실시간으로 할 일을 추가하고 \n지금 무엇을 해야 하는지 한눈에 볼 수 있어요.',
  eyebrow: '칸반보드',
  title: '칸반보드로 함께 \n할 일 목록을 관리해요',
} as const satisfies LandingSectionContent;

export const LANDING_TASKLIST_SECTION = {
  description:
    '담당자에 맞춰 해야 할 세부 항목을 정리하고 \n하나씩 빠르게 완료해보세요.',
  eyebrow: '세부 체크',
  image: imgLandingTasklist,
  imageAlt: '캘린더와 할 일 리스트 예시',
  imagePriority: true, // ✅ LCP 이미지
  title: '세부적으로 할 일들을\n간편하게 체크해요',
} as const satisfies LandingSectionContent;

export const LANDING_TASK_DETAIL_SECTION = {
  description:
    '대화로 진행상황을 기록하고 피드백을 주고받으며 \n함께 결론을 내릴 수 있어요.',
  eyebrow: '할 일 공유',
  image: imgLandingTaskDetail,
  imageAlt: '할 일 상세와 댓글 예시',
  imagePriority: false,
  title: '할 일 공유를 넘어\n의견을 나누고 함께 결정해요',
} as const satisfies LandingSectionContent;

export const REVEAL_DIRECTION_CLASS = {
  left: '-translate-x-6',
  right: 'translate-x-6',
  scale: 'translate-y-4 scale-95',
  up: 'translate-y-6',
} as const satisfies Record<LandingRevealDirection, string>;

export const REVEAL_DELAY_CLASS = {
  none: '',
  short: 'delay-100',
  medium: 'delay-200',
  long: 'delay-300',
} as const satisfies Record<LandingRevealDelay, string>;

export const REVEAL_OPTIONS = {
  rootMargin: '0px 0px -12% 0px',
  threshold: 0.1,
} as const satisfies IntersectionObserverInit;
