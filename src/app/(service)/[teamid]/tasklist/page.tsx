/**
 * 팀의 첫 번째 할 일 목록 페이지로 라우팅하는 리스트 진입 페이지입니다.
 */

'use client';

import { use, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import useTeamRouteGuard from '@/app/(service)/[teamid]/hooks/useTeamRouteGuard';
import type { TaskListPageParams } from '@/app/(service)/[teamid]/tasklist/types';
import { getFirstTaskListByDisplayIndex } from '@/app/(service)/[teamid]/tasklist/utils/taskListSummary';
import { ROUTES } from '@/constants/ROUTES';
import { useTeamDetailQuery } from '@/hooks/useTeam';

export default function TaskListPage({
  params,
}: {
  params: TaskListPageParams;
}) {
  const { teamid } = use(params);
  const router = useRouter();
  const { hasMemberships, isAccessible, isLoading } = useTeamRouteGuard({
    teamId: teamid,
  });
  const { data: groupDetail } = useTeamDetailQuery({
    teamId: teamid,
    options: {
      enabled: hasMemberships && isAccessible,
    },
  });

  const firstTaskList = getFirstTaskListByDisplayIndex(
    groupDetail?.taskLists ?? [],
  );

  useEffect(() => {
    if (firstTaskList) {
      router.replace(ROUTES.TASK_LIST_ITEM(teamid, String(firstTaskList.id)));
      return;
    }

    if (groupDetail && groupDetail.taskLists.length === 0) {
      router.replace(ROUTES.TEAM(teamid));
    }
  }, [firstTaskList, groupDetail, router, teamid]);

  if (isLoading || !isAccessible) {
    return null;
  }

  return null;
}
