'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ToastProvider } from '@/components/common/toast';
import { clearAuthSession, hasAuthSession } from '@/utils/authSession';
import { queryClient } from '@/utils/queryClient';

function MidnightSignOut() {
  useEffect(() => {
    if (!hasAuthSession()) return;

    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timer = setTimeout(() => {
      clearAuthSession('expired');
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MidnightSignOut />
        {children}
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
