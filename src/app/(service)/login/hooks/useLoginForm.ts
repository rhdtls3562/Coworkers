'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { ERROR_MESSAGES } from '@/constants/ERROR_MESSAGES';
import { useSignInMutation } from '@/hooks/useAuth';
import { loginFormSchema, type LoginFormValues } from '@/types/auth';
import { resolvePostAuthPath } from '@/utils/authRedirect';
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
  const signInMutation = useSignInMutation({
    onError: () => {
      setServerError(ERROR_MESSAGES.LOGIN_FAILED);
    },
    onSuccess: (data) => {
      const session = extractAuthSession(data);

      if (!session) {
        setServerError('로그인 응답을 확인할 수 없습니다.');
        return;
      }

      saveAuthSession(session);
      router.push(resolvePostAuthPath(TEAM_ID, redirectTo));
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: prefilledEmail ?? '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginFormSchema),
  });
  const [email, password] = useWatch({
    control,
    name: ['email', 'password'],
  });
  const isSubmittable = loginFormSchema.safeParse({
    email,
    password,
  }).success;

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

  return {
    emailError: errors.email?.message,
    emailField: register('email'),
    handleSubmit: handleSubmitForm,
    isDisabled: !isSubmittable || signInMutation.isPending,
    passwordError: errors.password?.message,
    passwordField: register('password'),
    serverError,
  };
}
