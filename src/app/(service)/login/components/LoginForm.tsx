'use client';

import { useState } from 'react';

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
import { buildSignupPath } from '@/utils/authRedirect';

type LoginFormProps = {
  prefilledEmail?: string;
  redirectTo?: string;
};

export default function LoginForm({
  prefilledEmail,
  redirectTo,
}: LoginFormProps) {
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

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
          <p className="text-center text-sm font-medium text-status-danger">
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

      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          onClose={() => setIsForgotPasswordModalOpen(false)}
        />
      )}
    </section>
  );
}
