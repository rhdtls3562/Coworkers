/**
 * 사이드바 상단 로고와 접기/펼치기 버튼 영역입니다.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  IcIndentLeftLarge,
  IcIndentRightLarge,
  ImgLogoSymbolLarge,
} from '@/assets';
import FullLogo from '@/components/common/logo/FullLogo';
import useLayoutAuthState from '@/components/layout/hooks/useLayoutAuthState';
import type { SidebarHeaderProps } from '@/components/layout/sidebar/types';
import { ROUTES } from '@/constants/ROUTES';
import { cn } from '@/utils/cn';

export default function SidebarHeader({
  isExpanded,
  onToggle,
}: SidebarHeaderProps) {
  const pathname = usePathname();
  const layoutAuthState = useLayoutAuthState(pathname);

  const firstTeamId = layoutAuthState.teams[0]?.id;
  const logoHref = firstTeamId
    ? ROUTES.TEAM(String(firstTeamId))
    : ROUTES.TEAM('nogroup');

  return (
    <div
      className={cn(
        'relative flex items-center justify-center pt-10',
        isExpanded && 'justify-between px-3.75 pt-9',
      )}
    >
      <Link href={logoHref} aria-label="첫 번째 팀 페이지로 이동">
        {isExpanded ? (
          <FullLogo size="sidebar" />
        ) : (
          <ImgLogoSymbolLarge
            width={35}
            height={24}
            role="img"
            aria-label="Coworkers"
          />
        )}
      </Link>

      <button
        type="button"
        aria-label={isExpanded ? '사이드바 메뉴 접기' : '사이드바 메뉴 펼치기'}
        onClick={onToggle}
        className={cn(
          'flex cursor-pointer items-center justify-center',
          isExpanded
            ? 'static rounded-none border-0'
            : 'absolute -right-5 top-9 size-8 rounded-full bg-background-inverse border border-slate-300',
        )}
      >
        {isExpanded ? (
          <IcIndentLeftLarge width={25} height={25} aria-hidden="true" />
        ) : (
          <IcIndentRightLarge
            width={22}
            height={22}
            className={cn('relative translate-x-0.5')}
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}
