/**
 * 마이 히스토리의 월 이동 헤더를 렌더링하는 컴포넌트입니다.
 */

'use client';

import HistoryCalendarPopover from '@/app/(service)/myhistory/components/HistoryCalendarPopover';
import useHistoryCalendarPopover from '@/app/(service)/myhistory/hooks/useHistoryCalendarPopover';
import useHistoryMonthNavigator from '@/app/(service)/myhistory/hooks/useHistoryMonthNavigator';
import type { HistoryMonthNavigatorProps } from '@/app/(service)/myhistory/types';
import { getHistoryRangeTitleParts } from '@/app/(service)/myhistory/utils/formatHistoryDate';
import {
  IcCalendarCircleLarge,
  IcChevronLeftCircle,
  IcChevronRightCircle,
} from '@/assets';

export default function HistoryMonthNavigator({
  onApplyRange,
  onMoveMonth,
  onResetRange,
  selectedRange,
  title,
}: HistoryMonthNavigatorProps) {
  const titleParts = getHistoryRangeTitleParts(selectedRange);
  const isRangeTitle = titleParts.length === 2;
  const {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  } = useHistoryCalendarPopover();
  const {
    draftRange,
    handleMoveMonth,
    handleRangeChange,
    handleToggleCalendar,
    rangeMonthLimit,
  } = useHistoryMonthNavigator({
    closeCalendar,
    isCalendarOpen,
    onApplyRange,
    onMoveMonth,
    onResetRange,
    selectedRange,
    toggleCalendar,
  });

  return (
    <div className="relative flex items-center justify-center">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="이전 달 보기"
          className="flex size-7 items-center justify-center rounded-lg"
          onClick={() => handleMoveMonth(-1)}
        >
          <IcChevronLeftCircle width={24} height={24} aria-hidden="true" />
        </button>

        <p className="text-center text-lg leading-tight font-bold text-text-primary md:text-xl md:leading-normal">
          {isRangeTitle ? (
            <span className="flex flex-col items-center gap-0 leading-none md:inline-flex md:flex-row md:gap-0 md:leading-normal">
              <span>{titleParts[0]}</span>
              <span className="block md:hidden">-</span>
              <span className="hidden px-1 md:inline">{' - '}</span>
              <span>{titleParts[1]}</span>
            </span>
          ) : (
            title
          )}
        </p>

        <button
          type="button"
          aria-label="다음 달 보기"
          className="flex size-7 items-center justify-center rounded-lg"
          onClick={() => handleMoveMonth(1)}
        >
          <IcChevronRightCircle width={24} height={24} aria-hidden="true" />
        </button>
      </div>

      <button
        ref={calendarButtonRef}
        type="button"
        aria-label="날짜 선택"
        aria-haspopup="dialog"
        aria-expanded={isCalendarOpen}
        className="absolute right-0 flex size-10 items-center justify-center rounded-lg"
        onClick={handleToggleCalendar}
      >
        <IcCalendarCircleLarge width={32} height={32} aria-hidden="true" />
      </button>

      {isCalendarOpen && (
        <HistoryCalendarPopover
          calendarRef={calendarRef}
          endDate={draftRange.endDate}
          maxDate={rangeMonthLimit.maxDate}
          minDate={rangeMonthLimit.minDate}
          onSelectRange={handleRangeChange}
          openToDate={draftRange.startDate ?? selectedRange.startDate}
          startDate={draftRange.startDate}
        />
      )}
    </div>
  );
}
