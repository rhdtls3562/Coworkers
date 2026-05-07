'use client';

/**
 * 사이드바의 팀 목록, 팀 추가, 채용 / 홍보 링크 영역입니다.
 */

import { useSyncExternalStore } from 'react';

import { usePathname } from 'next/navigation';

import useLayoutAuthState from '@/components/layout/hooks/useLayoutAuthState';
import SidebarNavItem from '@/components/layout/sidebar/components/SidebarNavItem';
import {
  SIDEBAR_ICONS,
  SIDEBAR_LINKS,
} from '@/components/layout/sidebar/constants';
import useSidebar from '@/components/layout/sidebar/hooks/useSidebar';
import type { SidebarNavProps } from '@/components/layout/sidebar/types';
import { ROUTES } from '@/constants/ROUTES';
import { cn } from '@/utils/cn';

function subscribeMounted(callback: () => void) {
  callback();

  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function SidebarNav({
  isExpanded,
  isMobileDrawer = false,
}: SidebarNavProps) {
  const { handleSidebarInteraction } = useSidebar();
  const pathname = usePathname();
  const layoutAuthState = useLayoutAuthState(pathname);

  const isMounted = useSyncExternalStore(
    subscribeMounted,
    getClientSnapshot,
    getServerSnapshot,
  );

  const canShowAuthUi = isMounted && layoutAuthState.isAuthenticated;

  const isBoardActive =
    pathname === SIDEBAR_LINKS.boards.href ||
    pathname.startsWith(`${SIDEBAR_LINKS.boards.href}/`);

  return (
    <nav
      aria-label="사이드바 메뉴"
      className={cn(
        'flex flex-col',
        isMobileDrawer
          ? 'px-4 pb-8'
          : isExpanded
            ? 'mt-14 px-3.75'
            : 'mt-11 items-center px-3',
      )}
    >
      {canShowAuthUi && (
        <>
          <ul
            className={cn(
              'flex flex-col',
              isMobileDrawer
                ? 'w-full gap-3'
                : isExpanded
                  ? 'w-full gap-2'
                  : 'items-center gap-2',
            )}
          >
            {layoutAuthState.teams.map((team) => {
              const teamHref = ROUTES.TEAM(team.id);
              const isActive =
                pathname === teamHref || pathname.startsWith(`${teamHref}/`);

              return (
                <SidebarNavItem
                  key={team.id}
                  href={teamHref}
                  icon={
                    team.isOwner ? SIDEBAR_ICONS.teamOwner : SIDEBAR_ICONS.team
                  }
                  isActive={isActive}
                  isExpanded={isExpanded}
                  isMobileDrawer={isMobileDrawer}
                  isOwnerIcon={team.isOwner}
                  label={team.name}
                  onClick={handleSidebarInteraction}
                  variant="team"
                />
              );
            })}
          </ul>

          <SidebarNavItem
            href={SIDEBAR_LINKS.addTeam.href}
            icon={SIDEBAR_ICONS.teamAdd}
            isExpanded={isExpanded}
            isMobileDrawer={isMobileDrawer}
            label={SIDEBAR_LINKS.addTeam.label}
            onClick={handleSidebarInteraction}
            variant="addTeam"
          />

          <div
            className={cn(
              'h-px bg-background-tertiary',
              isMobileDrawer
                ? 'mb-3 mt-6 w-full'
                : isExpanded
                  ? 'my-7 w-full'
                  : 'my-6 w-10',
            )}
          />
        </>
      )}

      <SidebarNavItem
        href={SIDEBAR_LINKS.boards.href}
        icon={SIDEBAR_ICONS.board}
        isActive={isBoardActive}
        isExpanded={isExpanded}
        isMobileDrawer={isMobileDrawer}
        label={SIDEBAR_LINKS.boards.label}
        onClick={handleSidebarInteraction}
        variant="board"
      />
    </nav>
  );
}
