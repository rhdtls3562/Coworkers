'use client';

import { use } from 'react';

import NoGroups from '@/app/(service)/[teamid]/components/NoGroups';
import TeamMemberList from '@/app/(service)/[teamid]/components/TeamMemberList';
import TeamProgress from '@/app/(service)/[teamid]/components/TeamProgress';
import TeamTaskList from '@/app/(service)/[teamid]/components/TeamTaskList';
import useTeamRouteGuard from '@/app/(service)/[teamid]/hooks/useTeamRouteGuard';
import useTodayTeamTaskLists from '@/app/(service)/[teamid]/hooks/useTodayTeamTaskLists';
import { TeamDetailData, TeamPageProps } from '@/app/(service)/[teamid]/types';
import { useTeamDetailQuery } from '@/hooks/useTeam';

export default function TaskDetailPage({ params }: TeamPageProps) {
  const { teamid } = use(params);
  const {
    hasMemberships,
    isAccessible,
    isLoading: isTeamRouteLoading,
    meData,
  } = useTeamRouteGuard({ teamId: teamid });
  const { data: teamData, isLoading: isTeamLoading } =
    useTeamDetailQuery<TeamDetailData>({
      teamId: teamid,
      options: {
        enabled: hasMemberships && isAccessible,
      },
    });
  const { isLoading: isTodayTaskListsLoading, todayTaskLists } =
    useTodayTeamTaskLists({
      teamData,
      teamId: teamid,
    });

  if (isTeamRouteLoading || isTeamLoading || isTodayTaskListsLoading)
    return null;

  if (!isAccessible) return null;

  if (!hasMemberships) {
    return <NoGroups />;
  }

  if (!teamData) return null;

  const todayTeamData = {
    ...teamData,
    taskLists: todayTaskLists,
  };

  const myRole = meData?.memberships.find(
    (m) => m.groupId === Number(teamid),
  )?.role;

  return (
    <div className="flex gap-4 flex-wrap pb-30 md:gap-8 md:px-6 md:pt-18 xl:w-full xl:py-30 xl:max-w-7xl xl:px-20">
      <TeamProgress role={myRole} teamData={todayTeamData} />
      <div className="flex w-full xl:border-t xl:border-background-tertiary xl:pt-8 xl:gap-6">
        <TeamTaskList {...todayTeamData} />
        <TeamMemberList teamData={teamData} role={myRole} />
      </div>
    </div>
  );
}
