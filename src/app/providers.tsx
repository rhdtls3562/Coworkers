'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

import { ToastProvider } from '@/components/common/toast';
import {
  clearAuthSession,
  hasAuthSession,
  subscribeAuthSessionChange,
} from '@/utils/authSession';
import { queryClient } from '@/utils/queryClient';

function MidnightSignOut() {
  useEffect(() => {
    let timerId: number | null = null;

    const clearTimer = () => {
      if (timerId === null) {
        return;
      }

      window.clearTimeout(timerId);
      timerId = null;
    };

    const scheduleMidnightSignOut = () => {
      clearTimer();

      if (!hasAuthSession()) {
        return;
      }

      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight.getTime() - now.getTime();

      timerId = window.setTimeout(() => {
        clearAuthSession('expired');
      }, msUntilMidnight);
    };

    scheduleMidnightSignOut();

    const unsubscribe = subscribeAuthSessionChange((reason) => {
      if (
        reason === 'manual' ||
        reason === 'expired' ||
        reason === 'unauthorized'
      ) {
        clearTimer();
        return;
      }

      scheduleMidnightSignOut();
    });

    return () => {
      clearTimer();
      unsubscribe();
    };
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <MidnightSignOut />
          {children}
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
