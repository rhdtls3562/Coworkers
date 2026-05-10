'use client';

import { use, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/ROUTES';
import { useTeamDetailQuery } from '@/hooks/useTeam';

export default function TaskListPage({
  params,
}: {
  params: Promise<{ teamid: string }>;
}) {
  const { teamid } = use(params);
  const router = useRouter();
  const { data: groupDetail } = useTeamDetailQuery({ teamId: teamid });

  const firstTaskList = (groupDetail?.taskLists ?? [])
    .slice()
    .sort((a, b) => a.displayIndex - b.displayIndex)[0];

  useEffect(() => {
    if (firstTaskList) {
      router.replace(ROUTES.TASK_LIST_ITEM(teamid, String(firstTaskList.id)));
    }
  }, [firstTaskList, router, teamid]);

  return null;
}
