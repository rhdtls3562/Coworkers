/** DatePicker range 값을 정규화하는 유틸 함수 파일입니다. */

import type { DatePickerRangeValue } from '@/components/common/form/types';

export function normalizeDatePickerRangeValue(
  date: Date | DatePickerRangeValue | null,
) {
  if (date === null) {
    return [null, null] satisfies DatePickerRangeValue;
  }

  if (Array.isArray(date)) {
    return date satisfies DatePickerRangeValue;
  }

  return null;
}
