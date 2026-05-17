/** 팀 페이지 할 일·태스크 관련 유틸 함수 파일입니다. */

import { STATUS } from '@/app/(service)/[teamid]/constants';
import {
  TaskItemDetailProps,
  TaskList,
  TeamDetailData,
} from '@/app/(service)/[teamid]/types';

export const getTaskListStatus = (
  tasks: TaskItemDetailProps[],
): (typeof STATUS)[number] => {
  if (tasks.length === 0) return '시작 전';
  const doneCount = tasks.filter((task) => task.doneAt !== null).length;
  if (doneCount === tasks.length) return '완료';
  if (doneCount > 0) return '진행 중';
  return '시작 전';
};

export const classifyTaskLists = (taskLists: TaskList[]) => {
  const result: Record<(typeof STATUS)[number], TaskList[]> = {
    '시작 전': [],
    '진행 중': [],
    완료: [],
  };
  taskLists.forEach((taskList) => {
    result[getTaskListStatus(taskList.tasks)].push(taskList);
  });
  return result;
};

export const totalTasks = (teamData: TeamDetailData) =>
  teamData.taskLists.reduce((acc, taskList) => acc + taskList.tasks.length, 0);

export const doneTasks = (teamData: TeamDetailData) =>
  teamData.taskLists.reduce(
    (acc, taskList) =>
      acc + taskList.tasks.filter((task) => task.doneAt !== null).length,
    0,
  );

export const donePercent = (teamData: TeamDetailData) => {
  const total = totalTasks(teamData);
  return total === 0 ? 0 : Math.round((doneTasks(teamData) / total) * 100);
};
