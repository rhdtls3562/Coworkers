/**
 * 로그인/회원가입 화면에서 공통으로 사용하는 소셜 인증 설정입니다.
 */

import type { ComponentType, SVGProps } from 'react';

import { IcKakaotalk } from '@/assets';

export type AuthSocialProvider = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconAlt: string;
  iconSize: number;
  loginLabel: string;
  provider: string;
  signupLabel: string;
};

export const AUTH_SOCIAL_PROVIDERS = [
  {
    icon: IcKakaotalk,
    iconAlt: '카카오 아이콘',
    iconSize: 44,
    loginLabel: '간편 로그인하기',
    provider: 'kakao',
    signupLabel: '카카오로 회원가입하기',
  },
] as const satisfies readonly AuthSocialProvider[];
