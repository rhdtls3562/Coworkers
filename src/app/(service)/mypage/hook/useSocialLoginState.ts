/**
 * 계정 설정 화면에서 현재 세션의 소셜 로그인 여부를 구독하는 훅입니다.
 */

'use client';

import { useSyncExternalStore } from 'react';

import {
  getAuthSession,
  subscribeAuthSessionChange,
} from '@/utils/authSession';

function readIsSocialLogin() {
  return Boolean(getAuthSession()?.user?.provider);
}

export function useSocialLoginState() {
  const isSocialLogin = useSyncExternalStore(
    subscribeAuthSessionChange,
    readIsSocialLogin,
    () => false,
  );

  return {
    isSocialLogin,
  };
}
