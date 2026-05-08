'use client';

/**
 * 로그인, 회원가입, 팀 참여하기 화면에서 공통으로 사용하는 입력창 컴포넌트입니다.
 */

import { useId, useState } from 'react';

import { IcVisibility, IcVisibilityOff } from '@/assets';
import Input from '@/components/common/form/components/Input';
import type { AuthInputProps } from '@/components/common/form/types';
import { cn } from '@/utils/cn';

export default function AuthInput({
  id,
  type = 'text',
  label,
  errorMessage,
  className,
  disabled,
  ...props
}: AuthInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const isPasswordInput = type === 'password';
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType = isPasswordInput
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type;

  const hasError = Boolean(errorMessage);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex w-full flex-col gap-2 md:gap-3">
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-5 text-text-primary md:text-base md:leading-6"
      >
        {label}
      </label>

      <div className="relative">
        <Input
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            'h-11 text-sm md:h-12 md:text-base',
            {
              'border-status-danger focus:border-status-danger': hasError,
              'pr-14 md:pr-16': isPasswordInput,
            },
            className,
          )}
          {...props}
        />

        {isPasswordInput && (
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            disabled={disabled}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            className={cn(
              'absolute right-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center md:size-6',
              {
                'cursor-not-allowed opacity-40': disabled,
              },
            )}
          >
            {isPasswordVisible ? (
              <IcVisibility
                width={24}
                height={24}
                className="size-5 md:size-6"
                aria-hidden="true"
              />
            ) : (
              <IcVisibilityOff
                width={24}
                height={24}
                className="size-5 md:size-6"
                aria-hidden="true"
              />
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p id={errorId} className="text-sm font-medium text-status-danger">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
