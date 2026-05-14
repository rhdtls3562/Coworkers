'use client';

import type { ReactNode } from 'react';

import ServiceRightPanelHost from '@/components/layout/components/ServiceRightPanelHost';
import { ServiceLayoutProvider } from '@/components/layout/context/ServiceLayoutContext';
import Header from '@/components/layout/header';
import useAuthSessionGuard from '@/components/layout/hooks/useAuthSessionGuard';
import Sidebar from '@/components/layout/sidebar';

type ServiceLayoutClientProps = {
  children: ReactNode;
};

export default function ServiceLayoutClient({
  children,
}: ServiceLayoutClientProps) {
  useAuthSessionGuard();

  return (
    <ServiceLayoutProvider>
      <div className="flex min-h-dvh flex-col bg-background-secondary">
        <Header />
        <div className="flex min-h-0 flex-1 overflow-x-clip bg-background-secondary">
          <Sidebar />
          <main className="min-w-0 flex-1 pt-13 md:pt-0">{children}</main>
          <ServiceRightPanelHost />
        </div>
      </div>
    </ServiceLayoutProvider>
  );
}
