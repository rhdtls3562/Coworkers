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

import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import { IcAlertCircleLarge, IcCloseMedium } from '@/assets/index';

import { ModalFrameProps } from '../types';

export default function ModalFrame({
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
}: ModalFrameProps) {
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
      className="fixed top-0 left-0 right-0 bottom-0 flex 
      justify-center items-end-safe md:justify-center md:items-center md:px-4 bg-black/60 z-999"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-tl-xl rounded-tr-xl p-10 pb-8 min-w-80 relative text-center md:max-w-sm md:rounded-3xl"
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
          <p className="text-sm text-gray-400">{subDescription}</p>
        )}
        {children && <div className="w-full mt-4">{children}</div>}
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
  );
}
