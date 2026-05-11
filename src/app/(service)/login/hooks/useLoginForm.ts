'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getMyGroups } from '@/api/userApi';
import { ERROR_MESSAGES } from '@/constants/ERROR_MESSAGES';
import { ROUTES } from '@/constants/ROUTES';
import { useSignInMutation } from '@/hooks/useAuth';
import { loginFormSchema, type LoginFormValues } from '@/types/auth';
import { getSafeRedirectTo } from '@/utils/authRedirect';
import { extractAuthSession, saveAuthSession } from '@/utils/authSession';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

type UseLoginFormParams = {
  prefilledEmail?: string;
  redirectTo?: string;
};

export default function useLoginForm({
  prefilledEmail,
  redirectTo,
}: UseLoginFormParams) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: prefilledEmail ?? '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginFormSchema),
  });

  const signInMutation = useSignInMutation({
    onError: () => {
      setServerError(ERROR_MESSAGES.LOGIN_FAILED);
    },
    onSuccess: async (data) => {
      const session = extractAuthSession(data);
      if (!session) {
        setServerError('로그인 응답을 확인할 수 없습니다.');
        return;
      }
      saveAuthSession(session);
      const safeRedirectTo = getSafeRedirectTo(redirectTo);
      if (safeRedirectTo) {
        router.push(safeRedirectTo);
        return;
      }
      try {
        const groups = await getMyGroups();
        const firstGroupId = groups[0]?.id;
        router.push(
          firstGroupId
            ? ROUTES.TEAM(String(firstGroupId))
            : ROUTES.TEAM('nogroup'),
        );
      } catch {
        router.push(ROUTES.TEAM('nogroup'));
      }
    },
  });

  const handleSubmitForm = handleSubmit((values) => {
    setServerError('');
    if (!TEAM_ID) {
      setServerError('팀 정보가 설정되지 않았습니다.');
      return;
    }
    signInMutation.mutate({
      body: values,
      teamId: TEAM_ID,
    });
  });

  const handleInputChange = () => {
    if (serverError) setServerError('');
  };

  return {
    emailError: errors.email?.message,
    emailField: register('email', {
      onChange: handleInputChange,
    }),
    handleSubmit: handleSubmitForm,
    isDisabled: !isValid || signInMutation.isPending,
    passwordError: errors.password?.message,
    passwordField: register('password', {
      onChange: handleInputChange,
    }),
    serverError,
  };
}
