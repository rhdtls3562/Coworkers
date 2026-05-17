/** DatePicker 캘린더 상단 연·월 네비게이션 헤더 컴포넌트입니다. */

import { IcChevronLeftSmall, IcChevronRightSmall } from '@/assets';

import type { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

export default function DatePickerCalendarHeader({
  decreaseMonth,
  increaseMonth,
  monthDate,
  nextMonthButtonDisabled,
  prevMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
  return (
    <div className="flex h-6 items-center justify-between px-11">
      <button
        type="button"
        aria-label="이전 달 보기"
        className="flex size-6 items-center justify-center rounded-lg disabled:opacity-40"
        disabled={prevMonthButtonDisabled}
        onClick={decreaseMonth}
      >
        <IcChevronLeftSmall
          width={16}
          height={16}
          className="size-4"
          aria-hidden="true"
        />
      </button>

      <p className="text-sm font-bold text-text-primary">
        {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
      </p>

      <button
        type="button"
        aria-label="다음 달 보기"
        className="flex size-6 items-center justify-center rounded-lg disabled:opacity-40"
        disabled={nextMonthButtonDisabled}
        onClick={increaseMonth}
      >
        <IcChevronRightSmall
          width={16}
          height={16}
          className="size-4"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
