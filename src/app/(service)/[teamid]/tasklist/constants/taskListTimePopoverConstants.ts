/**
 * 할 일 만들기 시간 선택 팝오버의 고정 옵션 상수입니다.
 */

export const TASK_LIST_TIME_PICKER_HOURS = Array.from(
  { length: 24 },
  (_, index) => String(index).padStart(2, '0'),
);

export const TASK_LIST_TIME_PICKER_MINUTES = Array.from(
  { length: 12 },
  (_, index) => String(index * 5).padStart(2, '0'),
);
