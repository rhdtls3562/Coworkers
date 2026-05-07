/**
 * 기간 범위 선택용 인라인 달력 팝오버를 렌더링하는 컴포넌트입니다.
 */

import type { HistoryCalendarPopoverProps } from '@/app/(service)/myhistory/types';
import { DatePicker } from '@/components/common/form';

export default function HistoryCalendarPopover({
  calendarRef,
  endDate,
  maxDate,
  minDate,
  onSelectRange,
  openToDate,
  startDate,
}: HistoryCalendarPopoverProps) {
  return (
    <div
      ref={calendarRef}
      role="dialog"
      aria-label="기간 선택 달력"
      className="absolute top-12 right-0 z-20"
    >
      <DatePicker
        isInline
        selectsRange
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        openToDate={openToDate}
        onChange={onSelectRange}
      />
    </div>
  );
}
