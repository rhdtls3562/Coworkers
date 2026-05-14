'use client';

/**
 * 모바일 헤더에서 여는 사이드바 드로어를 렌더링하는 컴포넌트입니다.
 */

import Link from 'next/link';

import { IcCloseLarge, ImgLogoSymbolLarge } from '@/assets';
import type { MobileSidebarDrawerProps } from '@/components/layout/header/types';
import SidebarFooter from '@/components/layout/sidebar/components/SidebarFooter';
import SidebarNav from '@/components/layout/sidebar/components/SidebarNav';
import { ROUTES } from '@/constants/ROUTES';
import { cn } from '@/utils/cn';

export default function MobileSidebarDrawer({
  isRendered,
  isVisible,
  onClose,
}: MobileSidebarDrawerProps) {
  if (!isRendered) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-text-primary/45 transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="모바일 사이드바 메뉴"
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 flex h-dvh w-56 flex-col bg-background-inverse text-text-default shadow-2xl transition-transform duration-300 will-change-transform',
          isVisible ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-7">
          <Link
            href={ROUTES.HOME}
            aria-label="랜딩 페이지로 이동"
            onClick={onClose}
          >
            <ImgLogoSymbolLarge
              width={35}
              height={24}
              className="h-6 w-auto"
              style={{ width: 'auto' }}
              role="img"
              aria-label="Coworkers"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="사이드바 메뉴 닫기"
            className="flex size-8 items-center justify-center"
          >
            <IcCloseLarge
              width={24}
              height={24}
              className="size-6"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <SidebarNav isExpanded isMobileDrawer />
          </div>

          <SidebarFooter isExpanded />
        </div>
      </aside>
    </>
  );
}
