/** DatePicker 요일 헤더를 커스텀 렌더링하는 유틸 함수 파일입니다. */

import { WEEK_DAY_LABELS } from '@/components/common/form/constants';

import type { ReactDatePickerCustomDayNameProps } from 'react-datepicker';

export function renderDatePickerWeekDay({
  day,
}: ReactDatePickerCustomDayNameProps) {
  return WEEK_DAY_LABELS[day.getDay()];
}
