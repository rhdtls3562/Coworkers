'use client';

/**
 * 팀 참여하기 폼 상태와 제출 로직을 관리하는 훅입니다.
 */

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { extractInvitationToken } from '@/app/(service)/jointeam/utils/extractInvitationToken';
import {
  joinTeamFormSchema,
  type JoinTeamFormValues,
} from '@/app/(service)/jointeam/utils/joinTeamFormSchema';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useAcceptTeamInvitationMutation } from '@/hooks/useTeam';
import { useMeQuery } from '@/hooks/useUser';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

function getJoinTeamErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : '팀 참여 중 문제가 발생했어요. 다시 시도해주세요.';
}

export function useJoinTeamForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');
  const acceptTeamInvitationMutation = useAcceptTeamInvitationMutation();
  const meQuery = useMeQuery<{ email?: string }>();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<JoinTeamFormValues>({
    defaultValues: {
      teamLink: '',
    },
    mode: 'onChange',
    resolver: zodResolver(joinTeamFormSchema),
  });
  const [teamLink] = useWatch({
    control,
    name: ['teamLink'],
  });
  const isSubmittable = joinTeamFormSchema.safeParse({
    teamLink,
  }).success;

  const teamLinkField = register('teamLink', {
    onChange: () => setServerError(''),
  });

  const handleSubmitForm = handleSubmit(async (values) => {
    setServerError('');

    if (!TEAM_ID) {
      setServerError('팀 정보가 설정되지 않았습니다.');
      return;
    }

    if (!meQuery.data?.email) {
      setServerError('사용자 정보를 불러오지 못했어요. 다시 로그인해주세요.');
      return;
    }

    try {
      const joinedTeam = await acceptTeamInvitationMutation.mutateAsync({
        body: {
          token: extractInvitationToken(values.teamLink),
          userEmail: meQuery.data.email,
        },
        teamId: TEAM_ID,
      });

      router.push(ROUTES.TEAM(String(joinedTeam.groupId)));
      showToast('팀 참여가 완료되었습니다.', 'success');
    } catch (error) {
      setServerError(getJoinTeamErrorMessage(error));
    }
  });

  return {
    errorMessage: errors.teamLink?.message ?? serverError,
    handleSubmit: handleSubmitForm,
    isDisabled:
      !isValid || !isSubmittable || acceptTeamInvitationMutation.isPending,
    teamLinkField,
  };
}
