/**
 * 팀 메인 화면에서 오늘 날짜 기준 task list 데이터를 만드는 유틸입니다.
 */

import type { TaskList } from '@/app/(service)/[teamid]/types';
import type { Task as ApiTask } from '@/types/task';

type TeamTaskListSummaryLike = {
  id: number;
  name: string;
};

function toTeamTaskItem(task: ApiTask) {
  const doneByUser = task.doneBy?.user
    ? {
        id: task.doneBy.user.id,
        image: task.doneBy.user.image ?? '',
        nickname: task.doneBy.user.nickname,
      }
    : null;

  return {
    commentCount: task.commentCount,
    date: task.date,
    deletedAt: task.deletedAt,
    description: task.description ?? '',
    displayIndex: task.displayIndex,
    doneAt: task.doneAt,
    doneBy: { user: doneByUser },
    frequency: task.frequency,
    id: task.id,
    name: task.name,
    recurringId: task.recurringId,
    updatedAt: task.updatedAt,
    user: doneByUser,
    writer: {
      id: task.writer.id,
      image: task.writer.image ?? '',
      nickname: task.writer.nickname,
    },
  };
}

export function toTodayTeamTaskLists(
  taskLists: readonly TeamTaskListSummaryLike[],
  taskListDetails: readonly ({ tasks?: ApiTask[] } | undefined)[],
) {
  return taskLists.map((taskList, index) => ({
    id: taskList.id,
    name: taskList.name,
    tasks: (taskListDetails[index]?.tasks ?? []).map(toTeamTaskItem),
  })) satisfies TaskList[];
}
