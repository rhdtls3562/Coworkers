/**
 * 마이 히스토리 보기 모드에 맞춰 팀 요약 카드 목록을 만드는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  HistoryTaskListSummaryBase,
  HistoryTeamDetail,
  MyHistorySummaryItem,
  MyHistoryViewMode,
} from '@/app/(service)/myhistory/types';
import {
  buildSourceTaskIdentityMap,
  buildTaskListTotalIdentityMap,
  toHistoryTaskListSummaryKey,
} from '@/app/(service)/myhistory/utils/myHistorySummaryCountUtils';

function buildTaskListBaseMap(
  teamDetail: HistoryTeamDetail,
  sources: readonly HistoryTaskListDetailSource[],
) {
  const taskListBaseMap = new Map<string, HistoryTaskListSummaryBase>();

  teamDetail.taskLists.forEach((taskList) => {
    taskListBaseMap.set(taskList.id, {
      displayIndex: taskList.displayIndex,
      id: taskList.id,
      name: taskList.name,
    });
  });

  sources
    .filter((source) => source.teamId === teamDetail.id)
    .forEach((source) => {
      if (taskListBaseMap.has(source.taskListId)) {
        return;
      }

      taskListBaseMap.set(source.taskListId, {
        displayIndex: source.displayIndex,
        id: source.taskListId,
        name: source.taskListName,
      });
    });

  return taskListBaseMap;
}

export function buildTeamSummaryCards(
  teamDetails: readonly HistoryTeamDetail[],
  completedTaskCountMap: ReadonlyMap<string, Set<string>>,
  countSources: readonly HistoryTaskListDetailSource[],
  totalCountSources: readonly HistoryTaskListDetailSource[],
  viewMode: MyHistoryViewMode,
) {
  const taskListTotalIdentityMap = buildTaskListTotalIdentityMap(
    teamDetails,
    totalCountSources,
  );
  const pendingTaskIdentityMap = buildSourceTaskIdentityMap(
    countSources,
    'pending',
  );

  return teamDetails.map((teamDetail) => {
    const details = Array.from(
      buildTaskListBaseMap(teamDetail, totalCountSources).values(),
    )
      .sort(
        (firstTaskList, secondTaskList) =>
          firstTaskList.displayIndex - secondTaskList.displayIndex,
      )
      .map((taskList) => {
        const taskListKey = toHistoryTaskListSummaryKey(
          teamDetail.id,
          taskList.id,
        );
        const doneCount = completedTaskCountMap.get(taskListKey)?.size ?? 0;
        const totalCount = taskListTotalIdentityMap.get(taskListKey)?.size ?? 0;
        const count =
          viewMode === 'pending'
            ? (pendingTaskIdentityMap.get(taskListKey)?.size ?? 0)
            : doneCount;

        return {
          doneCount: count,
          countText: `${count}/${totalCount}`,
          id: taskList.id,
          totalCount,
          title: taskList.name,
        };
      });
    const count = details.reduce((sum, detail) => sum + detail.doneCount, 0);

    return {
      count,
      countText: `${count}개`,
      details,
      id: teamDetail.id,
      title: teamDetail.name,
    } satisfies MyHistorySummaryItem;
  });
}
