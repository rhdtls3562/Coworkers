'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import ForgotPasswordModal from '@/app/(service)/login/components/ForgotPasswordModal';
import { LOGIN_TEXT } from '@/app/(service)/login/constants';
import useLoginForm from '@/app/(service)/login/hooks/useLoginForm';
import { PrimaryButton } from '@/components/common/button';
import {
  AuthInput,
  AuthSocialSection,
  AuthTitleBlock,
} from '@/components/common/form';
import { useToast } from '@/components/common/toast';
import { buildSignupPath } from '@/utils/authRedirect';

type LoginFormProps = {
  loginNotice?: 'auth-required';
  oauthError?: string;
  prefilledEmail?: string;
  redirectTo?: string;
};

function getOauthErrorMessage(oauthError?: string) {
  if (oauthError === 'oauth_not_configured') {
    return '카카오 로그인 설정을 확인할 수 없습니다. 배포 환경 변수를 확인해주세요.';
  }

  return null;
}

export default function LoginForm({
  loginNotice,
  oauthError,
  prefilledEmail,
  redirectTo,
}: LoginFormProps) {
  const { showToast } = useToast();
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const hasShownAuthNoticeRef = useRef(false);
  const hasShownOauthErrorRef = useRef(false);

  const {
    emailError,
    emailField,
    handleSubmit,
    isDisabled,
    passwordError,
    passwordField,
    serverError,
  } = useLoginForm({
    prefilledEmail,
    redirectTo,
  });
  const oauthErrorMessage = getOauthErrorMessage(oauthError);

  useEffect(() => {
    if (loginNotice !== 'auth-required' || hasShownAuthNoticeRef.current) {
      return;
    }

    hasShownAuthNoticeRef.current = true;
    showToast('로그인 후 이용해 주세요.', 'error');
  }, [loginNotice, showToast]);

  useEffect(() => {
    if (!oauthErrorMessage || hasShownOauthErrorRef.current) {
      return;
    }

    hasShownOauthErrorRef.current = true;
    showToast(oauthErrorMessage, 'error');
  }, [oauthErrorMessage, showToast]);

  return (
    <section className="mx-auto w-full max-w-lg rounded-[20px] bg-background-inverse px-5.25 py-9.25 md:px-8 md:py-12.5">
      <AuthTitleBlock title={LOGIN_TEXT.title} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:px-6">
        <AuthInput
          label={LOGIN_TEXT.emailLabel}
          type="text"
          errorMessage={emailError}
          placeholder={LOGIN_TEXT.emailPlaceholder}
          {...emailField}
        />

        <AuthInput
          label={LOGIN_TEXT.passwordLabel}
          type="password"
          errorMessage={passwordError}
          placeholder={LOGIN_TEXT.passwordPlaceholder}
          {...passwordField}
        />

        {serverError && (
          <p className="w-full text-left text-sm font-medium text-status-danger">
            {serverError}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsForgotPasswordModalOpen(true)}
            className="text-sm font-medium text-brand-primary underline"
          >
            {LOGIN_TEXT.forgotPassword}
          </button>
        </div>

        <PrimaryButton type="submit" disabled={isDisabled}>
          {LOGIN_TEXT.loginButton}
        </PrimaryButton>
      </form>

      {/* 회원가입 */}
      <p className="mt-6 text-center text-sm text-text-secondary">
        아직 계정이 없으신가요?
        <Link
          href={buildSignupPath(redirectTo)}
          className="ml-1 font-medium text-brand-primary underline"
        >
          가입하기
        </Link>
      </p>

      <AuthSocialSection mode="login" redirectTo={redirectTo} />

      {oauthErrorMessage && (
        <p className="mt-4 text-center text-sm font-medium text-status-danger">
          {oauthErrorMessage}
        </p>
      )}

      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      )}
    </section>
  );
}
