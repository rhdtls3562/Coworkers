'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { buildApiUrl, teamEndpoint } from '@/api/apiClient';
import { useToast } from '@/components/common/toast/hooks/useToast';
import { isGuestLayoutPath } from '@/components/layout/constants';
import { ROUTES } from '@/constants/ROUTES';
import {
  clearAuthSession,
  getAccessTokenExpirationTime,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  subscribeAuthSessionChange,
} from '@/utils/authSession';

const SESSION_EXPIRED_MESSAGE = '로그인이 만료되었습니다. 다시 로그인해주세요.';

export default function useAuthSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [sessionVersion, setSessionVersion] = useState(0);
  const hasHandledUnauthorizedRef = useRef(false);

  useEffect(() => {
    return subscribeAuthSessionChange((reason) => {
      if (reason === 'saved') {
        hasHandledUnauthorizedRef.current = false;
      }

      setSessionVersion((prev) => prev + 1);
    });
  }, []);

  useEffect(() => {
    const accessToken = getStoredAccessToken();
    const expirationTime = getAccessTokenExpirationTime(accessToken);

    if (!accessToken || !expirationTime) {
      return;
    }

    const remainingTime = expirationTime - Date.now();

    if (remainingTime <= 0) {
      clearAuthSession('expired');
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
              return; // 갱신 성공 시 로그아웃 안 함
            }
          }
        } catch {}
      }

      clearAuthSession('expired');
    }, remainingTime);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [sessionVersion]);

  useEffect(() => {
    return subscribeAuthSessionChange((reason) => {
      if (
        (reason !== 'expired' && reason !== 'unauthorized') ||
        isGuestLayoutPath(pathname)
      ) {
        return;
      }

      if (!hasHandledUnauthorizedRef.current) {
        hasHandledUnauthorizedRef.current = true;
        showToast(SESSION_EXPIRED_MESSAGE, 'error');
      }

      router.replace(ROUTES.LOGIN);
    });
  }, [pathname, router, showToast]);
}
