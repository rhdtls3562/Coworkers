/**
 * 팀별 완료 요약 카드와 필터 계산에 필요한 세부 유틸입니다.
 */

import type {
  HistorySummaryAccumulator,
  HistoryTaskListDetailSource,
  HistoryTeamDetail,
  MyHistoryFilter,
  MyHistorySummaryItem,
} from '@/app/(service)/myhistory/types';

function countCompletedTasksForCurrentUser(
  currentUserId: number | string | undefined,
  source: HistoryTaskListDetailSource,
) {
  return source.tasks.filter((task) =>
    currentUserId !== undefined
      ? String(task.doneByUserId) === String(currentUserId)
      : Boolean(task.doneAt),
  ).length;
}

function createEmptyTeamSummary(source: HistoryTaskListDetailSource) {
  return {
    details: new Map(),
    doneCount: 0,
    name: source.teamName,
  } satisfies HistorySummaryAccumulator;
}

function createEmptyTaskListSummary(source: HistoryTaskListDetailSource) {
  return {
    displayIndex: source.displayIndex,
    doneCount: 0,
    name: source.taskListName,
    totalCount: 0,
  } as const;
}

export function accumulateTeamSummariesFromTaskLists(
  currentUserId: number | string | undefined,
  sources: readonly HistoryTaskListDetailSource[],
) {
  return sources.reduce<Map<string, HistorySummaryAccumulator>>(
    (summaries, source) => {
      const teamSummary =
        summaries.get(source.teamId) ?? createEmptyTeamSummary(source);
      const taskListSummary =
        teamSummary.details.get(source.taskListId) ??
        createEmptyTaskListSummary(source);
      const completedCount = countCompletedTasksForCurrentUser(
        currentUserId,
        source,
      );

      taskListSummary.doneCount += completedCount;
      taskListSummary.totalCount += source.tasks.length;
      teamSummary.doneCount += completedCount;
      teamSummary.details.set(source.taskListId, {
        ...taskListSummary,
      });
      summaries.set(source.teamId, teamSummary);

      return summaries;
    },
    new Map(),
  );
}

export function buildTeamSummaryCards(
  teamDetails: readonly HistoryTeamDetail[],
  teamSummaryMap: ReadonlyMap<string, HistorySummaryAccumulator>,
) {
  return teamDetails.map((teamDetail) => {
    const matchedTeamSummary = teamSummaryMap.get(teamDetail.id);
    const details = teamDetail.taskLists.map((taskList) => {
      const matchedTaskListSummary = matchedTeamSummary?.details.get(
        taskList.id,
      );
      const doneCount = matchedTaskListSummary?.doneCount ?? 0;
      const totalCount = matchedTaskListSummary?.totalCount ?? 0;

      return {
        doneCount,
        countText: `${doneCount}/${totalCount}`,
        id: taskList.id,
        totalCount,
        title: taskList.name,
      };
    });
    const doneCount = matchedTeamSummary?.doneCount ?? 0;

    return {
      count: doneCount,
      countText: `${doneCount}개`,
      details,
      id: teamDetail.id,
      title: teamDetail.name,
    };
  });
}

export function buildHistoryTeamFilters(
  summaryItems: readonly MyHistorySummaryItem[],
) {
  return summaryItems.map(
    (item) =>
      ({
        count: item.count,
        id: item.id,
        label: item.title,
      }) satisfies MyHistoryFilter,
  );
}
