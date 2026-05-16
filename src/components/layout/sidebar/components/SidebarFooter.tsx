'use client';

/**
 * 사이드바 하단 유저 정보와 로그인 링크 영역입니다.
 */

import { useSyncExternalStore } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IcUserLarge } from '@/assets';
import ThemeToggle from '@/components/common/ThemeToggle';
import ProfileMenuDropdown from '@/components/layout/components/ProfileMenuDropdown';
import useLayoutAuthState from '@/components/layout/hooks/useLayoutAuthState';
import useSidebar from '@/components/layout/sidebar/hooks/useSidebar';
import type { SidebarFooterProps } from '@/components/layout/sidebar/types';
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

function getDisplayEmail(email: string, maxLength: number) {
  return email.length > maxLength ? `${email.slice(0, maxLength)}...` : email;
}

export default function SidebarFooter({ isExpanded }: SidebarFooterProps) {
  const { handleSidebarInteraction } = useSidebar();
  const pathname = usePathname();
  const layoutAuthState = useLayoutAuthState(pathname);

  const isMounted = useSyncExternalStore(
    subscribeMounted,
    getClientSnapshot,
    getServerSnapshot,
  );

  const canShowAuthUi = isMounted && layoutAuthState.isAuthenticated;
  const href = canShowAuthUi ? ROUTES.MY_PAGE : ROUTES.LOGIN;

  return (
    <div
      className={cn(
        'border-t border-background-tertiary py-4',
        isExpanded ? 'mx-4' : 'mx-3',
      )}
    >
      <ThemeToggle isExpanded={isExpanded} />
      {canShowAuthUi ? (
        <ProfileMenuDropdown
          className="w-full"
          onNavigate={handleSidebarInteraction}
          horizontalAlign="start"
          verticalPosition="top"
          trigger={
            <div
              className={cn(
                'flex min-h-12 w-full items-center overflow-hidden font-medium text-text-primary',
                isExpanded ? 'justify-start gap-3' : 'justify-center',
              )}
              aria-label="프로필 메뉴 열기"
            >
              <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-tertiary">
                {layoutAuthState.currentUser.image ? (
                  <Image
                    src={layoutAuthState.currentUser.image}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 object-cover"
                  />
                ) : (
                  <IcUserLarge width={24} height={24} aria-hidden="true" />
                )}
              </span>

              {isExpanded ? (
                <span className="animate-fadeIn flex min-w-0 flex-1 flex-col [animation-delay:150ms] [animation-fill-mode:both]">
                  <span className="truncate text-base font-semibold text-text-primary">
                    {layoutAuthState.currentUser.name}
                  </span>
                  {layoutAuthState.currentUser.email ? (
                    <span
                      title={layoutAuthState.currentUser.email}
                      className="block min-w-0 text-sm font-medium text-text-default"
                    >
                      <span className="md:hidden">
                        {getDisplayEmail(layoutAuthState.currentUser.email, 13)}
                      </span>
                      <span className="hidden md:inline">
                        {getDisplayEmail(layoutAuthState.currentUser.email, 20)}
                      </span>
                    </span>
                  ) : null}
                </span>
              ) : (
                <span className="sr-only">
                  {layoutAuthState.currentUser.name}
                </span>
              )}
            </div>
          }
        />
      ) : (
        <Link
          href={href}
          className={cn(
            'flex min-h-12 items-center overflow-hidden font-medium text-text-primary',
            isExpanded ? 'justify-start gap-3' : 'justify-center',
          )}
          aria-label="로그인 페이지로 이동"
          onClick={handleSidebarInteraction}
        >
          {isExpanded ? (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background-tertiary">
                <IcUserLarge width={24} height={24} aria-hidden="true" />
              </span>
              <span className="animate-fadeIn whitespace-nowrap text-base [animation-delay:150ms] [animation-fill-mode:both]">
                로그인
              </span>
            </>
          ) : (
            <span className="text-base">로그인</span>
          )}
        </Link>
      )}
    </div>
  );
}
