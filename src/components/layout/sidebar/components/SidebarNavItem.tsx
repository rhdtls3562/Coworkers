/**
 * 사이드바 메뉴 목록에서 하나의 링크 아이템을 렌더링하는 컴포넌트입니다.
 */

import Link from 'next/link';

import type { SidebarNavItemProps } from '@/components/layout/sidebar/types';
import { cn } from '@/utils/cn';

export default function SidebarNavItem({
  href,
  icon,
  isActive = false,
  isExpanded,
  isMobileDrawer = false,
  isOwnerIcon = false,
  label,
  onClick,
  variant = 'team',
}: SidebarNavItemProps) {
  const isMenuVariant = variant === 'team' || variant === 'board';

  const linkSizeClass = isMobileDrawer
    ? 'h-11 gap-4 rounded-lg px-5 text-sm hover:bg-background-secondary'
    : isExpanded
      ? 'h-12 gap-4 rounded-lg px-5 text-base hover:bg-background-secondary'
      : 'size-10 justify-center rounded-lg hover:bg-background-secondary';

  const addTeamSizeClass = isMobileDrawer
    ? 'mt-3 h-11 w-full gap-2 rounded-lg text-sm'
    : isExpanded
      ? 'mt-6 h-12 w-full gap-2 rounded-lg text-base'
      : 'mt-6 size-10 rounded-lg';

  const linkToneClass =
    variant === 'team'
      ? isActive
        ? 'bg-brand-secondary text-brand-primary'
        : 'text-text-primary'
      : variant === 'board'
        ? isActive
          ? 'bg-brand-secondary text-brand-primary'
          : 'text-text-primary'
        : variant === 'addTeam'
          ? 'justify-center border border-brand-primary text-brand-primary hover:bg-brand-secondary'
          : 'text-text-primary';

  const iconColorClass =
    variant === 'team'
      ? isOwnerIcon
        ? isActive
          ? 'bg-point-yellow'
          : 'bg-text-disabled'
        : isActive
          ? 'bg-brand-primary'
          : 'bg-text-disabled'
      : variant === 'board'
        ? isActive
          ? 'bg-brand-primary'
          : 'bg-text-disabled'
        : variant === 'addTeam'
          ? 'bg-brand-primary'
          : 'bg-text-disabled';

  const iconSrc = icon;

  const linkElement = (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        'flex items-center overflow-hidden font-medium transition-colors',
        isMenuVariant && linkSizeClass,
        variant === 'addTeam' && addTeamSizeClass,
        linkToneClass,
      )}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      {iconSrc ? (
        <span
          aria-hidden="true"
          className={cn('block size-5 shrink-0', iconColorClass)}
          style={{
            WebkitMask: `url(${iconSrc}) center / contain no-repeat`,
            mask: `url(${iconSrc}) center / contain no-repeat`,
          }}
        />
      ) : null}

      {isExpanded && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );

  if (variant === 'team') {
    return <li className={cn(isExpanded && 'w-full')}>{linkElement}</li>;
  }

  return linkElement;
}
