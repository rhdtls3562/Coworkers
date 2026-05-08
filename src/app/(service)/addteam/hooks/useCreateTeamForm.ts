'use client';

/**
 * 팀 생성하기 폼 상태와 제출 로직을 관리하는 훅입니다.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/components/common/toast';

const createTeamFormSchema = z.object({
  teamImage: z.custom<File | null>().optional(),
  teamName: z
    .string()
    .trim()
    .min(1, '팀 이름을 입력해주세요.')
    .refine(
      (value) => !/[^a-zA-Z0-9가-힣\s]/.test(value),
      '특수기호가 포함된 이름은 사용할 수 없습니다.',
    )
    .refine((value) => value.length <= 8, '8자 이내로 작성해 주세요.'),
});

type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>;

export function useCreateTeamForm() {
  const { showToast } = useToast();
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
    setValue('teamImage', newFile, {
      shouldDirty: true,
    });
  };

  const handleSubmitForm = handleSubmit((values) => {
    // TODO: API 연결
    console.log('팀 생성:', values.teamName, values.teamImage);
    showToast('팀이 생성되었습니다.', 'success');
  });

  return {
    errorMessage: errors.teamName?.message,
    handleChangeFile,
    handleSubmit: handleSubmitForm,
    isDisabled: !isValid,
    teamNameField: register('teamName'),
  };
}
