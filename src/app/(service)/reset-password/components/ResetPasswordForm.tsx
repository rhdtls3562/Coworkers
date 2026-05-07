'use client';

import Link from 'next/link';

import { RESET_PASSWORD_TEXT } from '@/app/(service)/reset-password/constants';
import useResetPasswordForm from '@/app/(service)/reset-password/hooks/useResetPasswordForm';
import { PrimaryButton } from '@/components/common/button';
import { AuthInput } from '@/components/common/form';
import FullLogo from '@/components/common/logo/FullLogo';
import { ROUTES } from '@/constants/ROUTES';

type ResetPasswordFormProps = {
  token?: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const {
    handleSubmit,
    isDisabled,
    passwordConfirmationError,
    passwordConfirmationField,
    passwordError,
    passwordField,
    serverError,
  } = useResetPasswordForm({
    token,
  });

  return (
    <section className="mx-auto w-full max-w-lg rounded-[20px] bg-background-inverse px-5.25 py-9.25 md:px-8 md:py-12.5">
      <h1 className="mb-8 flex justify-center md:mb-10">
        <Link href={ROUTES.HOME} aria-label="Coworkers 홈으로 이동">
          <FullLogo
            size="auth"
            className="origin-center scale-90 md:scale-100"
          />
        </Link>
      </h1>

      <h2 className="mb-6 text-center text-base font-semibold text-text-primary md:mb-8 md:text-lg">
        {RESET_PASSWORD_TEXT.title}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:px-6">
        <AuthInput
          label={RESET_PASSWORD_TEXT.passwordLabel}
          type="password"
          placeholder={RESET_PASSWORD_TEXT.passwordPlaceholder}
          errorMessage={passwordError}
          {...passwordField}
        />

        <AuthInput
          label={RESET_PASSWORD_TEXT.passwordConfirmationLabel}
          type="password"
          placeholder={RESET_PASSWORD_TEXT.passwordConfirmationPlaceholder}
          errorMessage={passwordConfirmationError}
          {...passwordConfirmationField}
        />

        {serverError && (
          <p className="text-center text-sm font-medium text-status-danger">
            {serverError}
          </p>
        )}

        <PrimaryButton type="submit" disabled={isDisabled}>
          {RESET_PASSWORD_TEXT.submitButton}
        </PrimaryButton>
      </form>
    </section>
  );
}
