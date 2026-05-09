/**
 * 팀(백엔드 Group) 상세, 멤버, 초대, 팀 수정 관련 서버 상태를 관리하는 훅 파일입니다.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { getTeamDetail, getTeamTasksByDate } from '@/api/groupApi';
import type { TeamScopedDateQueryParams } from '@/api/queryKeys';
import { teamQueryOptions } from '@/api/queryOptions';
import type { QueryOptionsOverrides } from '@/api/queryOptions/factory';

type TeamDetailData = Awaited<ReturnType<typeof getTeamDetail>>;
type TeamTasksByDateData = Awaited<ReturnType<typeof getTeamTasksByDate>>;

type UseTeamDetailParams<TData = TeamDetailData> = {
  options?: QueryOptionsOverrides<TeamDetailData, TData>;
  teamId: string;
};

type UseTeamTasksByDateParams<TData = TeamTasksByDateData> = {
  options?: QueryOptionsOverrides<TeamTasksByDateData, TData>;
  params: TeamScopedDateQueryParams;
  teamId: string;
};

export function useTeamDetailQuery<TData = TeamDetailData>(
  {
    options,
    teamId,
  }: UseTeamDetailParams<TData> = {} as UseTeamDetailParams<TData>,
) {
  return useQuery(teamQueryOptions.detail<TData>(teamId, options));
}

export function useTeamTasksByDateQuery<TData = TeamTasksByDateData>({
  options,
  params,
  teamId,
}: UseTeamTasksByDateParams<TData>) {
  return useQuery(teamQueryOptions.tasksByDate<TData>(teamId, params, options));
}

export {
  useAcceptTeamInvitationMutation,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useUpdateTeamMutation,
  useRemoveMemberTeamMutation,
} from '@/hooks/useTeamMutations';
