/**
 * 히스토리 섹션을 날짜 범위에 맞게 필터링하고 화면 표시용으로 변환하는 유틸입니다.
 */

import {
  MY_HISTORY_DATE_RANGE_MODES,
  MY_HISTORY_VIEW_MODES,
} from '@/app/(service)/myhistory/constants';
import type {
  HistorySectionWithParsedDate,
  MyHistoryDateRange,
  MyHistoryDateSection,
  MyHistoryDisplayDateSection,
  MyHistoryViewMode,
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

function toDisplaySection(
  section: MyHistoryDateSection,
): HistorySectionWithParsedDate {
  const parsedDate = parseHistoryDateKey(section.date);

  return {
    dateLabel: formatHistoryDate(parsedDate),
    groups: section.groups,
    id: section.id,
    parsedDate,
  };
}

function isSectionIncludedInRange(
  section: HistorySectionWithParsedDate,
  range: MyHistoryDateRange,
) {
  return range.mode === MY_HISTORY_DATE_RANGE_MODES.ALL
    ? true
    : isDateWithinHistoryRange(section.parsedDate, range);
}

function sortSectionsByLatestDate(
  firstSection: HistorySectionWithParsedDate,
  secondSection: HistorySectionWithParsedDate,
) {
  return secondSection.parsedDate.getTime() - firstSection.parsedDate.getTime();
}

function sortSectionsByEarliestDate(
  firstSection: HistorySectionWithParsedDate,
  secondSection: HistorySectionWithParsedDate,
) {
  return firstSection.parsedDate.getTime() - secondSection.parsedDate.getTime();
}

function toSectionViewModel(
  section: HistorySectionWithParsedDate,
): MyHistoryDisplayDateSection {
  return {
    dateLabel: section.dateLabel,
    groups: section.groups,
    id: section.id,
  };
}

export function buildVisibleHistorySections(
  sections: readonly MyHistoryDateSection[],
  range: MyHistoryDateRange,
  viewMode: MyHistoryViewMode,
) {
  return sections
    .map(toDisplaySection)
    .filter((section) => isSectionIncludedInRange(section, range))
    .sort(
      viewMode === MY_HISTORY_VIEW_MODES.PENDING
        ? sortSectionsByEarliestDate
        : sortSectionsByLatestDate,
    )
    .map(toSectionViewModel);
}
