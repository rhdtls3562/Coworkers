/**
 * 히스토리 보드에서 사용할 팀 상세 데이터를 조회하고 정규화하는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { teamQueryOptions } from '@/api/queryOptions';
import type {
  HistoryMembershipTeam,
  HistoryTeamDetail,
} from '@/app/(service)/myhistory/types';
import {
  hasHistoryQueryError,
  hasHistoryQueryLoading,
} from '@/app/(service)/myhistory/utils/historyBoardQueryUtils';
import { toHistoryTeamDetail } from '@/app/(service)/myhistory/utils/myHistoryData';

export default function useHistoryTeamDetailsQuery(
  teams: readonly HistoryMembershipTeam[],
) {
  const teamDetailQueries = useQueries({
    queries: teams.map((team) => teamQueryOptions.detail(team.id)),
  });

  const teamDetails = useMemo(
    () =>
      teamDetailQueries
        .map((query) => toHistoryTeamDetail(query.data))
        .filter((teamDetail): teamDetail is HistoryTeamDetail =>
          Boolean(teamDetail),
        ),
    [teamDetailQueries],
  );

  return {
    isError: hasHistoryQueryError(teamDetailQueries),
    isLoading: hasHistoryQueryLoading(teamDetailQueries),
    teamDetails,
  } as const;
}
