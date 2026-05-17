/** 버튼 컴포넌트 TypeScript 타입 정의 파일입니다. */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export type FloatingButtonProps = Omit<ButtonProps, 'children'> & {
  children?: ReactNode;
  buttonClassName?: string;
  dragBounds?: 'body' | string;
};
