/**
 * 내 히스토리 보드에 필요한 사용자와 팀 기본 데이터를 조회하고 정리하는 훅입니다.
 */

import { useMemo } from 'react';

import type { MyHistoryCompletedTaskRecord } from '@/app/(service)/myhistory/types';
import { getCompletedDateKeys } from '@/app/(service)/myhistory/utils/historyBoardDataUtils';
import { getUniqueHistoryTeams } from '@/app/(service)/myhistory/utils/historyBoardQueryUtils';
import {
  toHistoryCurrentUserId,
  toHistoryTeams,
} from '@/app/(service)/myhistory/utils/myHistoryData';
import { useMeQuery, useMyMembershipsQuery } from '@/hooks/useUser';

export default function useHistoryBoardBaseDataQuery(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
) {
  const {
    data: meData,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useMeQuery();
  const {
    data: membershipsData,
    isLoading: isMembershipsLoading,
    isError: isMembershipsError,
  } = useMyMembershipsQuery();

  const currentUserId = useMemo(() => toHistoryCurrentUserId(meData), [meData]);
  const teams = useMemo(
    () => toHistoryTeams(membershipsData),
    [membershipsData],
  );
  const uniqueTeams = useMemo(() => getUniqueHistoryTeams(teams), [teams]);
  const completedDateKeys = useMemo(
    () => getCompletedDateKeys(completedTasks),
    [completedTasks],
  );

  return {
    completedDateKeys,
    currentUserId,
    isMembershipsError,
    isMembershipsLoading,
    isMeError,
    isMeLoading,
    uniqueTeams,
  } as const;
}
