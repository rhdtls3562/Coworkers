'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { RESET_PASSWORD_TEXT } from '@/app/(service)/reset-password/constants';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useResetPasswordMutation } from '@/hooks/useUser';
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@/types/auth';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

type UseResetPasswordFormParams = {
  token?: string;
};

export default function useResetPasswordForm({
  token,
}: UseResetPasswordFormParams) {
  const router = useRouter();
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');
  const resetPasswordMutation = useResetPasswordMutation({
    onError: (error) => {
      setServerError(error.message);
    },
    onSuccess: () => {
      showToast(RESET_PASSWORD_TEXT.successMessage, 'success');
      router.replace(ROUTES.LOGIN);
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(resetPasswordFormSchema),
  });
  const [password, passwordConfirmation] = useWatch({
    control,
    name: ['password', 'passwordConfirmation'],
  });
  const isSubmittable =
    Boolean(token) &&
    resetPasswordFormSchema.safeParse({
      password,
      passwordConfirmation,
    }).success;

  const handleSubmitForm = handleSubmit((values) => {
    setServerError('');

    if (!TEAM_ID) {
      setServerError('팀 정보가 설정되지 않았습니다.');
      return;
    }

    if (!token) {
      setServerError(RESET_PASSWORD_TEXT.invalidToken);
      return;
    }

    resetPasswordMutation.mutate({
      body: {
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        token,
      },
      teamId: TEAM_ID,
    });
  });

  return {
    handleSubmit: handleSubmitForm,
    isDisabled: !isSubmittable || resetPasswordMutation.isPending,
    passwordConfirmationError: errors.passwordConfirmation?.message,
    passwordConfirmationField: register('passwordConfirmation'),
    passwordError: errors.password?.message,
    passwordField: register('password'),
    serverError,
  };
}
