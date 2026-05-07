'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { useToast } from '@/components/common/toast';
import { useSendResetPasswordEmailMutation } from '@/hooks/useUser';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@/types/auth';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

type UseForgotPasswordFormParams = {
  onSuccess: () => void;
};

export default function useForgotPasswordForm({
  onSuccess,
}: UseForgotPasswordFormParams) {
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');
  const sendResetPasswordEmailMutation = useSendResetPasswordEmailMutation({
    onError: (error) => {
      setServerError(error.message);
    },
    onSuccess: () => {
      onSuccess();
      showToast('비밀번호 재설정 링크를 보냈습니다.', 'success');
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(forgotPasswordFormSchema),
  });
  const [email] = useWatch({
    control,
    name: ['email'],
  });
  const isSubmittable = forgotPasswordFormSchema.safeParse({
    email,
  }).success;

  const handleSubmitForm = handleSubmit((values) => {
    setServerError('');

    if (!TEAM_ID) {
      setServerError('팀 정보가 설정되지 않았습니다.');
      return;
    }

    sendResetPasswordEmailMutation.mutate({
      body: {
        email: values.email,
        redirectUrl: window.location.origin,
      },
      teamId: TEAM_ID,
    });
  });

  return {
    emailError: errors.email?.message,
    emailField: register('email'),
    handleSubmit: handleSubmitForm,
    isDisabled: !isSubmittable || sendResetPasswordEmailMutation.isPending,
    serverError,
  };
}
