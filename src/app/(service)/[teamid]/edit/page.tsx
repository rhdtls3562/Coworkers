'use client';

import { use } from 'react';

import useTeamRouteGuard from '@/app/(service)/[teamid]/hooks/useTeamRouteGuard';
import { TeamDetailData, TeamPageProps } from '@/app/(service)/[teamid]/types';
import { useTeamDetailQuery } from '@/hooks/useTeam';

import EditTeamForm from './EditTeamForm';

export default function EditTeamPage({ params }: TeamPageProps) {
  const { teamid } = use(params);
  const { hasMemberships, isAccessible, isLoading } = useTeamRouteGuard({
    teamId: teamid,
  });
  const { data: teamData } = useTeamDetailQuery<TeamDetailData>({
    teamId: teamid,
    options: {
      enabled: hasMemberships && isAccessible,
    },
  });

  if (isLoading || !isAccessible) return null;

  if (!teamData) return null;

  return <EditTeamForm teamData={teamData} teamid={teamid} />;
}
