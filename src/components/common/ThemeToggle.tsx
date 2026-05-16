/**
 * 라이트/다크 모드를 전환하는 토글 버튼 컴포넌트입니다.
 */

'use client';

import { useSyncExternalStore } from 'react';

import { useTheme } from 'next-themes';

import { cn } from '@/utils/cn';

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5 shrink-0"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

type ThemeToggleProps = {
  isExpanded?: boolean;
  className?: string;
};

export default function ThemeToggle({
  isExpanded = true,
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const buttonClassName = cn(
    'flex min-h-10 w-full items-center overflow-hidden text-sm font-medium text-text-default transition-colors hover:text-brand-primary',
    isExpanded ? 'justify-start gap-3' : 'justify-center',
    className,
  );

  // 하이드레이션 완료 전에는 서버와 동일한 마크업을 렌더링해 불일치를 방지한다.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="다크 모드로 전환"
        className={buttonClassName}
      >
        <MoonIcon />
        {isExpanded && <span className="whitespace-nowrap">다크 모드</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className={buttonClassName}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isExpanded && (
        <span className="animate-fadeIn whitespace-nowrap [animation-delay:150ms] [animation-fill-mode:both]">
          {isDark ? '라이트 모드' : '다크 모드'}
        </span>
      )}
    </button>
  );
}
