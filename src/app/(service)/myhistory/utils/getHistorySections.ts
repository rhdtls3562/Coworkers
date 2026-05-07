/**
 * 히스토리 섹션을 날짜 범위에 맞게 필터링하고 화면 표시용으로 변환하는 유틸입니다.
 */

import type {
  MyHistoryDateRange,
  MyHistoryDateSection,
  MyHistoryDisplayDateSection,
} from '@/app/(service)/myhistory/types';
import {
  formatHistoryDate,
  isDateWithinHistoryRange,
  parseHistoryDateKey,
} from '@/app/(service)/myhistory/utils/formatHistoryDate';

export function hasHistoryTasks(
  sections: readonly MyHistoryDisplayDateSection[],
) {
  return sections.some((section) =>
    section.groups.some((group) => group.tasks.length > 0),
  );
}

export function getHistorySectionsInRange(
  sections: readonly MyHistoryDateSection[],
  range: MyHistoryDateRange,
) {
  return sections
    .map((section) => {
      const parsedDate = parseHistoryDateKey(section.date);

      return {
        ...section,
        dateLabel: formatHistoryDate(parsedDate),
        parsedDate,
      };
    })
    .filter((section) =>
      range.mode === 'all'
        ? true
        : isDateWithinHistoryRange(section.parsedDate, range),
    )
    .sort((firstSection, secondSection) => {
      return (
        secondSection.parsedDate.getTime() - firstSection.parsedDate.getTime()
      );
    })
    .map((section) => ({
      dateLabel: section.dateLabel,
      groups: section.groups,
      id: section.id,
    }));
}
