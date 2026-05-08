'use client';

import Link from 'next/link';

import { SIGNUP_TEXT } from '@/app/(service)/signup/constants';
import useSignupForm from '@/app/(service)/signup/hooks/useSignupForm';
import { PrimaryButton } from '@/components/common/button';
import {
  AuthInput,
  AuthSocialSection,
  AuthTitleBlock,
} from '@/components/common/form';
import { buildLoginPath } from '@/utils/authRedirect';

type SignupFormProps = {
  redirectTo?: string;
};

export default function SignupForm({ redirectTo }: SignupFormProps) {
  const {
    emailField,
    emailError,
    isDisabled,
    nicknameField,
    nicknameError,
    passwordConfirmationField,
    passwordConfirmationError,
    passwordField,
    passwordError,
    serverError,
    handleSubmit,
  } = useSignupForm({ redirectTo });

  return (
    <section className="mx-auto w-full max-w-lg rounded-[20px] bg-background-inverse px-5.25 py-9.25 md:px-8 md:py-12.5">
      <AuthTitleBlock title={SIGNUP_TEXT.title} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:px-6">
        <AuthInput
          label={SIGNUP_TEXT.nicknameLabel}
          placeholder={SIGNUP_TEXT.nicknamePlaceholder}
          errorMessage={nicknameError}
          {...nicknameField}
        />

        <AuthInput
          label={SIGNUP_TEXT.emailLabel}
          type="email"
          placeholder={SIGNUP_TEXT.emailPlaceholder}
          errorMessage={emailError}
          {...emailField}
        />

        <AuthInput
          label={SIGNUP_TEXT.passwordLabel}
          type="password"
          placeholder={SIGNUP_TEXT.passwordPlaceholder}
          errorMessage={passwordError}
          {...passwordField}
        />

        <AuthInput
          label={SIGNUP_TEXT.passwordConfirmationLabel}
          type="password"
          placeholder={SIGNUP_TEXT.passwordConfirmationPlaceholder}
          errorMessage={passwordConfirmationError}
          {...passwordConfirmationField}
        />

        {serverError && (
          <p className="text-center text-sm font-medium text-status-danger">
            {serverError}
          </p>
        )}

        <PrimaryButton
          type="submit"
          disabled={isDisabled}
          className="max-w-none"
        >
          {SIGNUP_TEXT.signupButton}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        {SIGNUP_TEXT.loginGuide}
        <Link
          href={buildLoginPath({ redirectTo })}
          className="ml-1 font-medium text-brand-primary underline"
        >
          {SIGNUP_TEXT.loginLink}
        </Link>
      </p>

      <AuthSocialSection mode="signup" redirectTo={redirectTo} />
    </section>
  );
}
