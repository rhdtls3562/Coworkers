import { useParams, useRouter } from 'next/navigation';

import { resolveTeamExitRoute } from '@/app/(service)/[teamid]/utils/teamRouteAccess';
import {
  useDeleteTeamMutation,
  useRemoveMemberTeamMutation,
} from '@/hooks/useTeam';
import { useMeQuery } from '@/hooks/useUser';

import { UseTeamProgressHandlersProps } from '../types';

export function useTeamProgressHandlers({
  selectedMember,
  reset,
  role,
}: UseTeamProgressHandlersProps) {
  const params = useParams();
  const router = useRouter();
  const { data: meData } = useMeQuery();

  const { mutate: deleteTeam } = useDeleteTeamMutation();
  const { mutate: removeMemberFromTeam } = useRemoveMemberTeamMutation();

  const canDeleteSelectedMember =
    role === 'ADMIN' &&
    selectedMember !== null &&
    selectedMember.role !== 'ADMIN';

  const handleDeleteTeam = () => {
    const fallbackRoute = resolveTeamExitRoute(
      String(params.teamid),
      meData?.memberships,
    );

    deleteTeam(
      { teamId: params.teamid as string },
      {
        onSuccess: () => {
          router.replace(fallbackRoute);
        },
      },
    );
  };
  const handleRemoveMemberFromTeam = () => {
    if (!selectedMember) return;

    removeMemberFromTeam(
      {
        teamId: params.teamid as string,
        memberUserId: selectedMember.userId,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };
  const handleLeaveTeam = () => {
    if (!meData?.id) return;

    const fallbackRoute = resolveTeamExitRoute(
      String(params.teamid),
      meData.memberships,
    );

    removeMemberFromTeam(
      {
        teamId: params.teamid as string,
        memberUserId: meData.id,
      },
      {
        onSuccess: () => {
          router.replace(fallbackRoute);
        },
      },
    );
  };

  return {
    canDeleteSelectedMember,
    handleDeleteTeam,
    handleLeaveTeam,
    handleRemoveMemberFromTeam,
  };
}
