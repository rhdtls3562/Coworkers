/**
 * 팀 관련 query options 모음입니다.
 *
 * 이 파일은 팀 메인 페이지처럼
 * - 팀 상세
 * - 날짜별 팀 할 일
 *
 * 을 조회하는 hook을 만들 때 사용합니다.
 */

import { getTeamDetail, getTeamTasksByDate } from '@/api/groupApi';
import type { TeamScopedDateQueryParams } from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import { QUERY_OPTION_DEFAULTS } from '@/api/queryOptions/constants';
import {
  createListQueryOptions,
  createQueryOptions,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import type {
  TeamDetailData,
  TeamTasksByDateData,
} from '@/api/queryOptions/types';

/** 팀 상세 / 날짜별 할 일 조회용 options입니다. */
export const teamQueryOptions = {
  detail: <TData = TeamDetailData>(
    teamId: string,
    options?: QueryOptionsOverrides<TeamDetailData, TData>,
  ) =>
    createQueryOptions<TeamDetailData, TData>({
      options,
      queryFn: () => getTeamDetail(teamId),
      queryKey: queryKeys.team.detail(teamId),
      staleTime: QUERY_OPTION_DEFAULTS.DETAIL_STALE_TIME,
    }),
  tasksByDate: <TData = TeamTasksByDateData>(
    teamId: string,
    params: TeamScopedDateQueryParams,
    options?: QueryOptionsOverrides<TeamTasksByDateData, TData>,
  ) =>
    createListQueryOptions<TeamTasksByDateData, TData>({
      options,
      queryFn: () => getTeamTasksByDate(teamId, params),
      queryKey: queryKeys.team.tasksByDate(teamId, params),
      staleTime: QUERY_OPTION_DEFAULTS.LIST_STALE_TIME,
    }),
} as const;
