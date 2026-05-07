/**
 * 히스토리 보드의 중복 제거와 쿼리 결과 병합을 돕는 유틸입니다.
 */

import type {
  HistoryMembershipTeam,
  HistoryTaskListDescriptor,
  HistoryTaskListDetailSource,
} from '@/app/(service)/myhistory/types';
import { toHistoryTaskListDetailSource } from '@/app/(service)/myhistory/utils/myHistoryData';

import type { UseQueryResult } from '@tanstack/react-query';

export function getUniqueHistoryTeams(teams: readonly HistoryMembershipTeam[]) {
  const map = new Map<string | number, HistoryMembershipTeam>();

  teams.forEach((team) => {
    map.set(team.id, team);
  });

  return [...map.values()];
}

export function getTaskListDescriptorKey(
  descriptor: HistoryTaskListDescriptor,
) {
  return `${descriptor.teamId}-${descriptor.taskListId}-${descriptor.dateKey}`;
}

export function getUniqueHistoryTaskListDescriptors(
  taskListDescriptors: readonly HistoryTaskListDescriptor[],
) {
  const map = new Map<string, HistoryTaskListDescriptor>();

  taskListDescriptors.forEach((descriptor) => {
    map.set(getTaskListDescriptorKey(descriptor), descriptor);
  });

  return [...map.values()];
}

export function getHistoryTaskListSources(
  uniqueTaskListDescriptors: readonly HistoryTaskListDescriptor[],
  taskListDetailQueries: readonly UseQueryResult<unknown, Error>[],
) {
  return uniqueTaskListDescriptors.reduce<HistoryTaskListDetailSource[]>(
    (sources, descriptor, index) => {
      const data = taskListDetailQueries[index]?.data;

      if (!data) {
        return sources;
      }

      sources.push(toHistoryTaskListDetailSource(data, descriptor));

      return sources;
    },
    [],
  );
}

export function hasHistoryQueryError(
  queries: readonly UseQueryResult<unknown, Error>[],
) {
  return queries.some((query) => query.isError);
}

export function hasHistoryQueryLoading(
  queries: readonly UseQueryResult<unknown, Error>[],
) {
  return queries.some((query) => query.isLoading);
}
