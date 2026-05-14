/**
 * 인증 세션 상태를 감시하고, 토큰 만료 시 세션을 정리하는 훅입니다.
 */

'use client';

import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { buildApiUrl, teamEndpoint } from '@/api/apiClient';
import { useToast } from '@/components/common/toast/hooks/useToast';
import { isPublicServicePath } from '@/components/layout/constants';
import { buildLoginPath, getSafeRedirectTo } from '@/utils/authRedirect';
import {
  clearAuthSession,
  getAccessTokenExpirationTime,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  subscribeAuthSessionChange,
} from '@/utils/authSession';

const REFRESH_BUFFER_MS = 60 * 1000;

export default function useAuthSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => {
    if (isPublicServicePath(pathname)) {
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

    const handleRefreshOrSignOut = async () => {
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
              return true;
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
      return false;
    };

    const remainingTime = expirationTime - Date.now() - REFRESH_BUFFER_MS;

    if (remainingTime <= 0) {
      void handleRefreshOrSignOut();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void handleRefreshOrSignOut();
    }, remainingTime);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, router, sessionVersion, showToast]);

  useEffect(() => {
    const unsubscribe = subscribeAuthSessionChange((reason) => {
      if (reason === 'saved' || reason === 'refreshed') {
        setSessionVersion((previousVersion) => previousVersion + 1);
        return;
      }

      router.refresh();
    });

    return unsubscribe;
  }, [router]);
}
