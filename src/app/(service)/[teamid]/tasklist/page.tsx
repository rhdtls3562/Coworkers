'use client';

import { use, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import useTeamRouteGuard from '@/app/(service)/[teamid]/hooks/useTeamRouteGuard';
import { ROUTES } from '@/constants/ROUTES';
import { useTeamDetailQuery } from '@/hooks/useTeam';

export default function TaskListPage({
  params,
}: {
  params: Promise<{ teamid: string }>;
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

  const firstTaskList = (groupDetail?.taskLists ?? [])
    .slice()
    .sort((a, b) => a.displayIndex - b.displayIndex)[0];

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
