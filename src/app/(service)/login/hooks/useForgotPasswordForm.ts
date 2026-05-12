/**
 * 비밀번호 재설정 이메일 전송 폼의 입력, 검증, 제출 상태를 관리하는 훅입니다.
 */

'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import type { ApiError } from '@/api/types';
import { useToast } from '@/components/common/toast';
import { useSendResetPasswordEmailMutation } from '@/hooks/useUser';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@/types/auth';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;
const UNKNOWN_EMAIL_ERROR_MESSAGE =
  '가입하지 않은 이메일입니다. 입력한 이메일을 다시 확인해주세요.';
const FORGOT_PASSWORD_DEFAULT_ERROR_MESSAGE =
  '비밀번호 재설정 링크를 보내지 못했습니다. 잠시 후 다시 시도해주세요.';
const UNKNOWN_EMAIL_ERROR_STATUSES = new Set([400, 404]);
const UNKNOWN_EMAIL_ERROR_PATTERNS = [
  '이메일',
  '찾을 수 없',
  '존재하지 않',
  'not found',
  'user not found',
] as const;

type UseForgotPasswordFormParams = {
  onSuccess: () => void;
};

function getForgotPasswordErrorMessage(error: ApiError) {
  const normalizedMessage = error.message.toLowerCase();
  const hasUnknownEmailStatus =
    error.status !== undefined &&
    UNKNOWN_EMAIL_ERROR_STATUSES.has(error.status);
  const hasUnknownEmailPattern = UNKNOWN_EMAIL_ERROR_PATTERNS.some((pattern) =>
    normalizedMessage.includes(pattern),
  );

  if (hasUnknownEmailStatus || hasUnknownEmailPattern) {
    return UNKNOWN_EMAIL_ERROR_MESSAGE;
  }

  return FORGOT_PASSWORD_DEFAULT_ERROR_MESSAGE;
}

export default function useForgotPasswordForm({
  onSuccess,
}: UseForgotPasswordFormParams) {
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');
  const sendResetPasswordEmailMutation = useSendResetPasswordEmailMutation({
    onError: (error) => {
      setServerError(getForgotPasswordErrorMessage(error));
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
        // 백엔드가 재설정 경로와 토큰을 조합하므로 origin만 전달합니다.
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
