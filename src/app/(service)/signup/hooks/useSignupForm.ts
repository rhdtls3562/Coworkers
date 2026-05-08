'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import useAutoSignInAfterSignup from '@/app/(service)/signup/hooks/useAutoSignInAfterSignup';
import { useSignUpMutation } from '@/hooks/useAuth';
import { signUpFormSchema, type SignUpFormValues } from '@/types/auth';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

type UseSignupFormParams = {
  redirectTo?: string;
};

export default function useSignupForm({ redirectTo }: UseSignupFormParams) {
  const [serverError, setServerError] = useState('');
  const { handleSignUpSuccess, isPending: isAutoSignInPending } =
    useAutoSignInAfterSignup({ redirectTo });
  const signUpMutation = useSignUpMutation({
    onError: (error) => {
      setServerError(error.message);
    },
    onSuccess: (_, variables) => {
      handleSignUpSuccess({
        email: variables.body.email,
        password: variables.body.password,
        teamId: variables.teamId,
      });
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      email: '',
      nickname: '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(signUpFormSchema),
  });
  const [email, nickname, password, passwordConfirmation] = useWatch({
    control,
    name: ['email', 'nickname', 'password', 'passwordConfirmation'],
  });
  const isSubmittable = signUpFormSchema.safeParse({
    email,
    nickname,
    password,
    passwordConfirmation,
  }).success;

  const handleSubmitForm = handleSubmit((values) => {
    setServerError('');

    if (!TEAM_ID) {
      setServerError('팀 정보가 설정되지 않았습니다.');
      return;
    }

    signUpMutation.mutate({
      body: values,
      teamId: TEAM_ID,
    });
  });

  return {
    emailError: errors.email?.message,
    emailField: register('email'),
    handleSubmit: handleSubmitForm,
    isDisabled:
      !isSubmittable || isAutoSignInPending || signUpMutation.isPending,
    nicknameError: errors.nickname?.message,
    nicknameField: register('nickname'),
    passwordConfirmationError: errors.passwordConfirmation?.message,
    passwordConfirmationField: register('passwordConfirmation'),
    passwordError: errors.password?.message,
    passwordField: register('password'),
    serverError,
  };
}
