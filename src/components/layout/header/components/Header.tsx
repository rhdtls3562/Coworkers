/**
 * 상단 네비게이션바 컴포넌트입니다.
 */

'use client';

import { useSyncExternalStore } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IcGnbMenu, IcUserLarge, ImgLogoSymbolLarge } from '@/assets';
import ProfileMenuDropdown from '@/components/layout/components/ProfileMenuDropdown';
import MobileSidebarDrawer from '@/components/layout/header/components/MobileSidebarDrawer';
import useMobileSidebar from '@/components/layout/header/hooks/useMobileSidebar';
import useLayoutAuthState from '@/components/layout/hooks/useLayoutAuthState';
import { ROUTES } from '@/constants/ROUTES';

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

export default function Header() {
  const pathname = usePathname();
  const layoutAuthState = useLayoutAuthState(pathname);

  const { handleClose, handleToggle, isRendered, isVisible, menuButtonRef } =
    useMobileSidebar();

  const isMounted = useSyncExternalStore(
    subscribeMounted,
    getClientSnapshot,
    getServerSnapshot,
  );

  const canShowAuthUi = isMounted && layoutAuthState.isAuthenticated;
  const firstTeamId = layoutAuthState.teams[0]?.id;
  const logoHref =
    canShowAuthUi && firstTeamId
      ? ROUTES.TEAM(String(firstTeamId))
      : canShowAuthUi
        ? ROUTES.TEAM('nogroup')
        : ROUTES.HOME;

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex h-13 w-full items-center border-b border-background-tertiary bg-background-inverse px-4">
        <div className="flex items-center gap-3">
          {canShowAuthUi && (
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={
                isVisible ? '사이드바 메뉴 닫기' : '사이드바 메뉴 열기'
              }
              onClick={handleToggle}
              className="flex size-6 shrink-0 items-center"
            >
              <IcGnbMenu
                width={24}
                height={24}
                className="size-6"
                aria-hidden="true"
              />
            </button>
          )}

          <Link href={logoHref} aria-label="첫 번째 팀 페이지로 이동">
            <ImgLogoSymbolLarge
              width={35}
              height={24}
              className="h-6 w-auto"
              style={{ width: 'auto' }}
              role="img"
              aria-label="Coworkers"
            />
          </Link>
        </div>

        {canShowAuthUi ? (
          <ProfileMenuDropdown
            className="ml-auto"
            trigger={
              <span
                aria-label="프로필 메뉴 열기"
                className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-border-secondary"
              >
                {layoutAuthState.currentUser.image ? (
                  <Image
                    src={layoutAuthState.currentUser.image}
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 object-cover"
                  />
                ) : (
                  <IcUserLarge
                    width={24}
                    height={24}
                    className="size-6"
                    aria-hidden="true"
                  />
                )}
              </span>
            }
          />
        ) : (
          <Link
            href={ROUTES.LOGIN}
            className="ml-auto text-sm font-medium text-text-primary"
          >
            로그인
          </Link>
        )}
      </header>

      {canShowAuthUi && (
        <MobileSidebarDrawer
          isRendered={isRendered}
          isVisible={isVisible}
          onClose={handleClose}
        />
      )}
    </>
  );
}
