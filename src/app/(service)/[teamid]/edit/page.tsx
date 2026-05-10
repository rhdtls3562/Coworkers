'use client';

import { use } from 'react';

import { TeamDetailData, TeamPageProps } from '@/app/(service)/[teamid]/types';
import { useTeamDetailQuery } from '@/hooks/useTeam';

import EditTeamForm from './EditTeamForm';

export default function EditTeamPage({ params }: TeamPageProps) {
  const { teamid } = use(params);
  const { data: teamData } = useTeamDetailQuery<TeamDetailData>({
    teamId: teamid,
  });

  if (!teamData) return null;

  return <EditTeamForm teamData={teamData} teamid={teamid} />;
}
