/**
 * 로그인/회원가입 화면에서 사용하는 공통 소셜 인증 버튼입니다.
 */

import type { ComponentType, SVGProps } from 'react';

type AuthSocialButtonProps = {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconAlt: string;
  iconSize: number;
  label: string;
};

export default function AuthSocialButton({
  href,
  icon: Icon,
  iconAlt,
  iconSize,
  label,
}: AuthSocialButtonProps) {
  return (
    <a
      href={href}
      className="mx-auto mt-4 flex h-11 w-full max-w-md items-center justify-between md:px-6"
    >
      <span className="text-sm text-text-secondary">{label}</span>
      <Icon
        width={iconSize}
        height={iconSize}
        className="h-11 w-11"
        role="img"
        aria-label={iconAlt}
      />
    </a>
  );
}
