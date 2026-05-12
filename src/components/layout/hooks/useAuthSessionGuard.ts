/**
 * 인증 세션 상태를 감시하고, 토큰 만료 시 세션을 정리하는 훅입니다.
 */

'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { buildApiUrl, teamEndpoint } from '@/api/apiClient';
import { useToast } from '@/components/common/toast/hooks/useToast';
import { isGuestLayoutPath } from '@/components/layout/constants';
import { buildLoginPath, getSafeRedirectTo } from '@/utils/authRedirect';
import {
  clearAuthSession,
  getAccessTokenExpirationTime,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  subscribeAuthSessionChange,
} from '@/utils/authSession';

export default function useAuthSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (isGuestLayoutPath(pathname)) {
      return;
    }

    const redirectTo = getSafeRedirectTo(
      `${window.location.pathname}${window.location.search}`,
    );

    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      clearAuthSession('expired');
      router.replace(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo,
        }),
      );
      return;
    }

    const expirationTime = getAccessTokenExpirationTime(accessToken);

    if (!expirationTime) {
      clearAuthSession('expired');
      router.replace(
        buildLoginPath({
          redirectTo,
        }),
      );
      return;
    }

    const remainingTime = expirationTime - Date.now();

    if (remainingTime <= 0) {
      clearAuthSession('expired');
      router.replace(
        buildLoginPath({
          redirectTo,
        }),
      );
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      const refreshToken = getStoredRefreshToken();

      if (refreshToken) {
        try {
          const res = await fetch(
            buildApiUrl(teamEndpoint('/auth/refresh-token')),
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            },
          );

          if (res.ok) {
            const data = (await res.json()) as { accessToken?: string };

            if (data.accessToken) {
              setStoredAccessToken(data.accessToken);
              return;
            }
          }
        } catch (error) {
          console.error('Failed to refresh access token:', error);
        }
      }

      clearAuthSession('expired');
      showToast('로그인 시간이 만료되었습니다. 다시 로그인해 주세요.', 'error');
      router.replace(
        buildLoginPath({
          redirectTo,
        }),
      );
    }, remainingTime);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, router, showToast]);

  useEffect(() => {
    const unsubscribe = subscribeAuthSessionChange(() => {
      router.refresh();
    });

    return unsubscribe;
  }, [router]);
}
