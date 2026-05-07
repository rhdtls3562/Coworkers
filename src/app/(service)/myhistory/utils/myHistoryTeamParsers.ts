/**
 * 멤버십과 팀 상세 응답을 마이 히스토리 전용 데이터로 변환하는 유틸입니다.
 */

import type {
  HistoryMembershipTeam,
  HistoryTaskListSummary,
  HistoryTeamDetail,
} from '@/app/(service)/myhistory/types';
import {
  isRecord,
  toNumber,
} from '@/app/(service)/myhistory/utils/myHistoryShared';

export function toHistoryTeams(data: unknown) {
  if (!Array.isArray(data)) {
    return [] as HistoryMembershipTeam[];
  }

  return data.reduce<HistoryMembershipTeam[]>((teams, membership) => {
    if (!isRecord(membership) || !isRecord(membership.group)) {
      return teams;
    }

    const teamId =
      typeof membership.group.id === 'number' ||
      typeof membership.group.id === 'string'
        ? String(membership.group.id)
        : null;
    const teamName =
      typeof membership.group.name === 'string' ? membership.group.name : null;

    if (!teamId || !teamName) {
      return teams;
    }

    teams.push({
      createdAt:
        typeof membership.group.createdAt === 'string'
          ? membership.group.createdAt
          : undefined,
      id: teamId,
      name: teamName,
    });

    return teams;
  }, []);
}

export function toHistoryCurrentUserId(data: unknown) {
  if (!isRecord(data)) {
    return undefined;
  }

  const candidate = isRecord(data.data) ? data.data : data;

  return toNumber(candidate.id);
}

export function toHistoryTeamDetail(data: unknown) {
  if (!isRecord(data)) {
    return undefined;
  }

  const teamId =
    typeof data.id === 'number' || typeof data.id === 'string'
      ? String(data.id)
      : null;
  const teamName = typeof data.name === 'string' ? data.name : null;

  if (!teamId || !teamName) {
    return undefined;
  }

  const taskLists = Array.isArray(data.taskLists)
    ? data.taskLists.reduce<HistoryTaskListSummary[]>((list, taskList) => {
        if (!isRecord(taskList)) {
          return list;
        }

        const taskListId =
          typeof taskList.id === 'number' || typeof taskList.id === 'string'
            ? String(taskList.id)
            : null;
        const taskListName =
          typeof taskList.name === 'string' ? taskList.name : null;

        if (!taskListId || !taskListName) {
          return list;
        }

        list.push({
          displayIndex: toNumber(taskList.displayIndex) ?? 0,
          id: taskListId,
          name: taskListName,
        });

        return list;
      }, [])
    : [];

  return {
    id: teamId,
    name: teamName,
    taskLists: taskLists.sort(
      (firstTaskList, secondTaskList) =>
        firstTaskList.displayIndex - secondTaskList.displayIndex,
    ),
  } satisfies HistoryTeamDetail;
}
