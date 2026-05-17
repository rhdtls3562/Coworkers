/** 마이페이지 비밀번호 변경 폼의 Zod 유효성 검사 스키마입니다. */

import { z } from 'zod';

export const passwordSchema = z
  .object({
    newPassword: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않아요.',
    path: ['confirmPassword'],
  });
