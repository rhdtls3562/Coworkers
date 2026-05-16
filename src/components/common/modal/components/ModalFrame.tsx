/**
 * ModalFrame 컴포넌트 Props
 * - children (ReactNode): 모달 내부 콘텐츠
 * - hasIcon (boolean): 아이콘 표시 여부 (true 시 느낌표 아이콘)
 * - hasCloseButton (boolean): 닫기 버튼 표시 여부
 * - title (string): 타이틀
 * - subTitle (string): 서브 타이틀 (멤버 몇명에 사용)
 * - description (string): 기본 문구 (진한 텍스트)
 * - subDescription (string): 서브 문구 (회색 텍스트)
 * - onClose (() => void): 닫기 버튼 클릭 핸들러
 * - lineButtonText (string): 라인 버튼 텍스트
 * - onLineButtonClick (() => void): 라인 버튼 클릭 핸들러
 * - primaryButtonText (string): 파란 버튼 텍스트
 * - onPrimaryButtonClick (() => void): 파란 버튼 클릭 핸들러
 * - isPrimaryButtonDisabled 파란버튼 비활성화
 * - subButtonText (string): 빨간 버튼 텍스트
 * - onSubButtonClick (() => void): 빨간 버튼 클릭 핸들러
 * - isButtonAlign (boolean): 버튼 정렬 (true: 세로 1열, false: 가로 2열)
 */

'use client';

import { useEffect } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import { IcAlertCircleLarge, IcCloseMedium } from '@/assets/index';
import { cn } from '@/utils/cn';

import { ModalFrameProps } from '../types';

export default function ModalFrame({
  bodyClassName,
  children,
  hasIcon,
  hasCloseButton = true,
  title,
  subTitle,
  description,
  subDescription,
  lineButtonText,
  onLineButtonClick,
  primaryButtonText,
  onPrimaryButtonClick,
  isPrimaryButtonDisabled,
  subButtonText,
  onSubButtonClick,
  isButtonAlign,
  onClose,
  overlayClassName,
}: ModalFrameProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleKeyDownCapture = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    const target = event.target;

    if (
      !(target instanceof HTMLElement) ||
      target instanceof HTMLButtonElement ||
      target instanceof HTMLAnchorElement ||
      target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (onPrimaryButtonClick) {
      if (isPrimaryButtonDisabled) {
        return;
      }

      event.preventDefault();
      onPrimaryButtonClick();
      return;
    }

    if (onSubButtonClick) {
      event.preventDefault();
      onSubButtonClick();
      return;
    }

    if (onLineButtonClick) {
      event.preventDefault();
      onLineButtonClick();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-999 bg-black/60 overflow-y-auto',
        overlayClassName,
      )}
      data-allow-unsaved="true"
      onClick={onClose}
    >
      <div
        className={cn(
          'min-h-full flex justify-center',
          'items-end pt-12 md:items-center md:py-6 md:px-4',
        )}
      >
        <div
          className={cn(
            'relative w-full bg-background-primary text-center',
            'rounded-tl-xl rounded-tr-xl py-10 px-5 pb-8 min-w-80 md:rounded-3xl md:p-6',
            'md:max-w-sm',
          )}
          onClick={(e) => e.stopPropagation()}
          onKeyDownCapture={handleKeyDownCapture}
        >
          {hasCloseButton && (
            <button
              type="button"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <IcCloseMedium
                width="24"
                height="24"
                role="img"
                aria-label="모달 닫기 아이콘"
              />
            </button>
          )}
          {hasIcon && (
            <div className="flex justify-center items-center mb-4">
              <IcAlertCircleLarge
                width="24"
                height="24"
                role="img"
                aria-label="느낌표 아이콘"
              />
            </div>
          )}
          {title && (
            <div className="flex gap-1 items-center justify-center mb-2">
              <p className="text-xl font-bold whitespace-pre-line">{title}</p>
              {subTitle && (
                <p className="text-base text-text-default">{subTitle}</p>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-text-secondary whitespace-pre-line">
              {description}
            </p>
          )}
          {subDescription && (
            <p className="text-sm text-text-default">{subDescription}</p>
          )}
          {children && (
            <div className={cn('mt-4 w-full', bodyClassName)}>{children}</div>
          )}
          <div
            className={`flex gap-2 mt-6 w-full mx-auto ${isButtonAlign ? 'flex-col px-4' : 'flex-row px-0'} max-w-90`}
          >
            {lineButtonText && (
              <button
                type="button"
                className="border border-border-secondary rounded-xl px-4 py-2.75 w-full text-text-default font-medium hover:enabled:bg-background-secondary"
                onClick={onLineButtonClick}
              >
                {lineButtonText}
              </button>
            )}
            {primaryButtonText && (
              <button
                type="button"
                className="bg-brand-primary rounded-xl px-4 py-2.75 w-full text-white font-medium hover:enabled:bg-interaction-hover disabled:bg-interaction-inactive"
                onClick={onPrimaryButtonClick}
                disabled={isPrimaryButtonDisabled}
              >
                {primaryButtonText}
              </button>
            )}
            {subButtonText && (
              <button
                type="button"
                className="bg-status-danger rounded-xl px-4 py-2.75 w-full text-white font-medium hover:enabled:bg-status-hover disabled:bg-interaction-inactive"
                onClick={onSubButtonClick}
              >
                {subButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
