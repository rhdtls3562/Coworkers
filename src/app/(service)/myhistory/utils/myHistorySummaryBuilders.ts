/**
 * 팀별 요약 카드와 필터 데이터를 만드는 유틸입니다.
 */

import type {
  HistorySummaryAccumulator,
  HistoryTaskListDetailSource,
  HistoryTeamDetail,
  MyHistoryFilter,
  MyHistorySummaryItem,
} from '@/app/(service)/myhistory/types';

export function getHistorySummaryData(
  currentUserId: number | string | undefined,
  teamDetails: readonly HistoryTeamDetail[],
  sources: readonly HistoryTaskListDetailSource[],
) {
  const teamSummaries = sources.reduce<Map<string, HistorySummaryAccumulator>>(
    (summaries, source) => {
      const teamSummary =
        summaries.get(source.teamId) ??
        ({
          details: new Map(),
          doneCount: 0,
          name: source.teamName,
        } satisfies HistorySummaryAccumulator);
      const detailSummary =
        teamSummary.details.get(source.taskListId) ??
        ({
          displayIndex: source.displayIndex,
          doneCount: 0,
          name: source.taskListName,
          totalCount: 0,
        } as const);

      const doneCount = source.tasks.filter((task) =>
        currentUserId !== undefined
          ? String(task.doneByUserId) === String(currentUserId)
          : Boolean(task.doneAt),
      ).length;

      detailSummary.doneCount += doneCount;
      detailSummary.totalCount += source.tasks.length;
      teamSummary.doneCount += doneCount;
      teamSummary.details.set(source.taskListId, {
        ...detailSummary,
      });
      summaries.set(source.teamId, teamSummary);

      return summaries;
    },
    new Map(),
  );

  const items = teamDetails.map((teamDetail) => {
    const teamSummary = teamSummaries.get(teamDetail.id);
    const details = teamDetail.taskLists.map((taskList) => {
      const detail = teamSummary?.details.get(taskList.id);

      return {
        countText: `${detail?.doneCount ?? 0}/${detail?.totalCount ?? 0}`,
        id: taskList.id,
        title: taskList.name,
      };
    });

    return {
      countText: `${teamSummary?.doneCount ?? 0}개`,
      details,
      id: teamDetail.id,
      title: teamDetail.name,
    };
  });

  return {
    filters: items.map(
      (item) =>
        ({
          count: Number(item.countText.replace('개', '')) || 0,
          id: item.id,
          label: item.title,
        }) satisfies MyHistoryFilter,
    ),
    items: items satisfies MyHistorySummaryItem[],
  };
}
