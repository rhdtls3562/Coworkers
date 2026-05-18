/**
 * 할 일 목록 요약 배열의 정렬·선택 보조 유틸입니다.
 */

import { getSafeTaskListArray } from '@/app/(service)/[teamid]/tasklist/utils/taskListRuntimeGuards';
import type { TaskListSummary } from '@/types/task';

export function getFirstTaskListByDisplayIndex(
  taskLists: readonly TaskListSummary[],
) {
  return getSafeTaskListArray(taskLists)
    .slice()
    .sort((firstTaskList, secondTaskList) => {
      return firstTaskList.displayIndex - secondTaskList.displayIndex;
    })[0];
}
