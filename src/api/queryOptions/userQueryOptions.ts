/**
 * 사용자 관련 query options 모음입니다.
 *
 * 이 파일은 현재 로그인한 사용자를 기준으로 한 조회에서 사용합니다.
 *
 * 예:
 * - 내 정보 -> `me`
 * - 내가 속한 팀 목록 -> `memberships`
 * - 내가 가진 그룹 목록 -> `groups`
 * - 마이히스토리 완료 목록 -> `completedTasks`
 */

import type {
  CompletedTaskHistoryQueryParams,
  QueryParams,
} from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import { QUERY_OPTION_DEFAULTS } from '@/api/queryOptions/constants';
import {
  createListQueryOptions,
  createQueryOptions,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import type {
  CompletedTasksData,
  MeData,
  MyGroupsData,
  MyMembershipsData,
} from '@/api/queryOptions/types';
import {
  getCompletedTasks,
  getMe,
  getMyGroups,
  getMyMemberships,
} from '@/api/userApi';

/** 사용자 / 마이페이지 / 마이히스토리에서 공통으로 사용하는 options입니다. */
export const userQueryOptions = {
  completedTasks: <TData = CompletedTasksData>(
    params?: CompletedTaskHistoryQueryParams,
    options?: QueryOptionsOverrides<CompletedTasksData, TData>,
  ) =>
    createListQueryOptions<CompletedTasksData, TData>({
      options,
      queryFn: () => getCompletedTasks(params),
      queryKey: queryKeys.user.completedTasks(params),
      staleTime: QUERY_OPTION_DEFAULTS.USER_LIST_STALE_TIME,
    }),
  groups: <TData = MyGroupsData>(
    params?: QueryParams,
    options?: QueryOptionsOverrides<MyGroupsData, TData>,
  ) =>
    createListQueryOptions<MyGroupsData, TData>({
      options,
      queryFn: () => getMyGroups(params),
      queryKey: queryKeys.user.groups(params),
      staleTime: QUERY_OPTION_DEFAULTS.USER_LIST_STALE_TIME,
    }),
  me: <TData = MeData>(options?: QueryOptionsOverrides<MeData, TData>) =>
    createQueryOptions<MeData, TData>({
      options,
      queryFn: getMe,
      queryKey: queryKeys.user.me(),
      staleTime: QUERY_OPTION_DEFAULTS.USER_ME_STALE_TIME,
    }),
  memberships: <TData = MyMembershipsData>(
    params?: QueryParams,
    options?: QueryOptionsOverrides<MyMembershipsData, TData>,
  ) =>
    createListQueryOptions<MyMembershipsData, TData>({
      options,
      queryFn: () => getMyMemberships(params),
      queryKey: queryKeys.user.memberships(params),
      staleTime: QUERY_OPTION_DEFAULTS.USER_LIST_STALE_TIME,
    }),
} as const;
