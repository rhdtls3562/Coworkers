/** clsx와 tailwind-merge를 결합한 조건부 className 유틸 함수입니다. */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
