/**
 * 로그인/회원가입 화면의 공통 소셜 인증 영역입니다.
 */

import AuthSocialButton from '@/components/common/form/components/AuthSocialButton';
import { AUTH_SOCIAL_PROVIDERS } from '@/constants/AUTH';
import { buildOauthAuthorizePath } from '@/utils/authRedirect';

type AuthSocialSectionProps = {
  mode: 'login' | 'signup';
  redirectTo?: string;
};

export default function AuthSocialSection({
  mode,
  redirectTo,
}: AuthSocialSectionProps) {
  return (
    <>
      <div className="mx-auto mt-10 flex w-full max-w-md items-center gap-4 md:px-6">
        <div className="h-px flex-1 bg-background-tertiary" />
        <span className="text-sm text-text-secondary">OR</span>
        <div className="h-px flex-1 bg-background-tertiary" />
      </div>

      {AUTH_SOCIAL_PROVIDERS.map((provider) => (
        <AuthSocialButton
          key={provider.provider}
          href={buildOauthAuthorizePath(provider.provider, redirectTo)}
          icon={provider.icon}
          iconAlt={provider.iconAlt}
          iconSize={provider.iconSize}
          label={mode === 'login' ? provider.loginLabel : provider.signupLabel}
        />
      ))}
    </>
  );
}
