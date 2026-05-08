'use client';

/**
 * 팀 참여하기 폼 상태와 제출 로직을 관리하는 훅입니다.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/components/common/toast';

const joinTeamFormSchema = z.object({
  teamLink: z.string().trim().min(1, '팀 링크를 입력해주세요.'),
});

type JoinTeamFormValues = z.infer<typeof joinTeamFormSchema>;

export function useJoinTeamForm() {
  const { showToast } = useToast();
  const {
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

  const handleSubmitForm = handleSubmit(() => {
    // TODO: 참여 API 연결
    showToast('팀 참여가 완료되었습니다.', 'success');
  });

  return {
    errorMessage: errors.teamLink?.message,
    handleSubmit: handleSubmitForm,
    isDisabled: !isValid,
    teamLinkField: register('teamLink'),
  };
}
