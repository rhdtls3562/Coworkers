'use client';

/**
 * 팀 참여하기 폼 상태와 제출 로직을 관리하는 훅입니다.
 */

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { TEAM_ID } from '@/app/(service)/jointeam/constants';
import { buildJoinTeamLink } from '@/app/(service)/jointeam/utils/buildJoinTeamLink';
import { extractInvitationGroupId } from '@/app/(service)/jointeam/utils/extractInvitationGroupId';
import { extractInvitationToken } from '@/app/(service)/jointeam/utils/extractInvitationToken';
import {
  handleAlreadyJoinedTeam,
  joinTeamByLink,
} from '@/app/(service)/jointeam/utils/joinTeamActions';
import {
  joinTeamFormSchema,
  type JoinTeamFormValues,
} from '@/app/(service)/jointeam/utils/joinTeamFormSchema';
import { useToast } from '@/components/common/toast';
import { useAcceptTeamInvitationMutation } from '@/hooks/useTeam';
import { useMeQuery } from '@/hooks/useUser';

export function useJoinTeamForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [hasStartedManualJoin, setHasStartedManualJoin] = useState(false);
  const [serverError, setServerError] = useState('');
  const hasHandledJoinedTeamRef = useRef(false);
  const acceptTeamInvitationMutation = useAcceptTeamInvitationMutation();
  const meQuery = useMeQuery();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<JoinTeamFormValues>({
    defaultValues: {
      teamLink: '',
    },
    mode: 'onChange',
    resolver: zodResolver(joinTeamFormSchema),
  });

  const teamLinkField = register('teamLink', {
    onChange: () => setServerError(''),
  });
  const currentTeamLink = useWatch({
    control,
    name: 'teamLink',
  });
  const hasTeamLinkInput = (currentTeamLink ?? '').trim().length > 0;

  const invitationGroupId = extractInvitationGroupId(
    searchParams.get('groupId') ?? '',
  );
  const invitationToken = extractInvitationToken(
    searchParams.get('token') ?? '',
  );
  const hasJoinedInvitationGroup = meQuery.data?.memberships?.some(
    (membership) => String(membership.groupId) === invitationGroupId,
  );

  useEffect(() => {
    if (!invitationToken) {
      return;
    }

    setValue(
      'teamLink',
      buildJoinTeamLink({
        groupId: invitationGroupId,
        token: invitationToken,
      }),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  }, [invitationGroupId, invitationToken, setValue]);

  useEffect(() => {
    if (hasStartedManualJoin) {
      return;
    }

    if (invitationGroupId && hasJoinedInvitationGroup) {
      if (hasHandledJoinedTeamRef.current) {
        return;
      }

      hasHandledJoinedTeamRef.current = true;
      handleAlreadyJoinedTeam({
        groupId: invitationGroupId,
        router,
        setServerError,
        showToast,
      });
      return;
    }
  }, [
    acceptTeamInvitationMutation,
    hasStartedManualJoin,
    hasJoinedInvitationGroup,
    router,
    showToast,
    invitationGroupId,
  ]);

  const handleSubmitForm = handleSubmit(async (values) => {
    setHasStartedManualJoin(true);

    const submitGroupId = extractInvitationGroupId(values.teamLink);

    if (
      submitGroupId &&
      meQuery.data?.memberships?.some(
        (membership) => String(membership.groupId) === submitGroupId,
      )
    ) {
      handleAlreadyJoinedTeam({
        groupId: submitGroupId,
        router,
        setServerError,
        showToast,
      });
      return;
    }

    const isJoined = await joinTeamByLink({
      acceptInvitation: acceptTeamInvitationMutation,
      email: meQuery.data?.email,
      router,
      setServerError,
      showToast,
      teamId: TEAM_ID,
      teamLink: values.teamLink,
    });

    if (!isJoined) {
      setHasStartedManualJoin(false);
    }
  });

  return {
    errorMessage: errors.teamLink?.message ?? serverError,
    handleSubmit: handleSubmitForm,
    isDisabled: !hasTeamLinkInput || acceptTeamInvitationMutation.isPending,
    teamLinkField,
  };
}
