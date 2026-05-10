/**
 * 팀 페이지를 구성하는 파일입니다.
 */
'use client';

import { use } from 'react';

import NoGroups from '@/app/(service)/[teamid]/components/NoGroups';
import TeamMemberList from '@/app/(service)/[teamid]/components/TeamMemberList';
import TeamProgress from '@/app/(service)/[teamid]/components/TeamProgress';
import TeamTaskList from '@/app/(service)/[teamid]/components/TeamTaskList';
import { TeamDetailData, TeamPageProps } from '@/app/(service)/[teamid]/types';
import { useTeamDetailQuery } from '@/hooks/useTeam';
import { type MeData, useMeQuery } from '@/hooks/useUser';

export default function TaskDetailPage({ params }: TeamPageProps) {
  const { teamid } = use(params);

  const { data: meData } = useMeQuery() as { data: MeData | undefined };
  const { data: teamData, isLoading: isTeamLoading } =
    useTeamDetailQuery<TeamDetailData>({ teamId: teamid });

  if (isTeamLoading) return null;

  if (!meData?.memberships?.length) {
    return <NoGroups />;
  }

  if (!teamData) return null;

  const myRole = meData.memberships.find(
    (m) => m.groupId === Number(teamid),
  )?.role;

  return (
    <div className="flex gap-4 flex-wrap pb-30 md:gap-8 md:px-6 md:pt-18 xl:w-full xl:py-30 xl:max-w-7xl xl:px-20">
      <TeamProgress role={myRole} teamData={teamData} />
      <div className="flex w-full xl:border-t xl:border-background-tertiary xl:pt-8 xl:gap-6">
        <TeamTaskList {...teamData} />
        <TeamMemberList teamData={teamData} />
      </div>
    </div>
  );
}
