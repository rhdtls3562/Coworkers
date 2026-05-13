/**
 * 할 일 만들기 폼의 반복 입력 보조 유틸입니다.
 */

export const DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS = [1, 2, 3, 4, 5] as const;

export function clampTaskListMonthDay(day: number): number {
  if (Number.isNaN(day) || day < 1) {
    return 1;
  }

  if (day > 31) {
    return 31;
  }

  return Math.floor(day);
}
