'use client';

/**
 * 팀 생성하기 폼 상태와 제출 로직을 관리하는 훅입니다.
 */

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  createTeamFormSchema,
  type CreateTeamFormValues,
} from '@/app/(service)/addteam/utils/createTeamFormSchema';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useUploadImageMutation } from '@/hooks/useImage';
import { useCreateTeamMutation } from '@/hooks/useTeam';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

function getCreateTeamErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : '팀 생성 중 문제가 발생했어요. 다시 시도해주세요.';
}

export function useCreateTeamForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');
  const uploadImageMutation = useUploadImageMutation();
  const createTeamMutation = useCreateTeamMutation();
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
  } = useForm<CreateTeamFormValues>({
    defaultValues: {
      teamImage: null,
      teamName: '',
    },
    mode: 'onChange',
    resolver: zodResolver(createTeamFormSchema),
  });

  const handleChangeFile = (newFile: File | null) => {
    setServerError('');
    setValue('teamImage', newFile, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const teamNameField = register('teamName', {
    onChange: () => setServerError(''),
  });

  const handleSubmitForm = handleSubmit(async (values) => {
    setServerError('');

    if (!TEAM_ID) {
      setServerError('팀 정보가 설정되지 않았습니다.');
      return;
    }

    try {
      const uploadedImage = values.teamImage
        ? await uploadImageMutation.mutateAsync({
            file: values.teamImage,
          })
        : null;
      const createdTeam = await createTeamMutation.mutateAsync({
        body: {
          image: uploadedImage?.url,
          name: values.teamName.trim(),
        },
        teamId: TEAM_ID,
      });

      router.push(ROUTES.TEAM(String(createdTeam.id)));
      showToast('팀이 생성되었습니다.', 'success');
    } catch (error) {
      setServerError(getCreateTeamErrorMessage(error));
      return;
    }
  });

  return {
    errorMessage: errors.teamName?.message ?? serverError,
    handleChangeFile,
    handleSubmit: handleSubmitForm,
    isDisabled:
      !isValid || createTeamMutation.isPending || uploadImageMutation.isPending,
    teamNameField,
  };
}
