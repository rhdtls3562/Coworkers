import { z } from 'zod';

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.currentPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않아요.',
    path: ['confirmPassword'], // 에러를 confirmPassword 필드에 표시
  });
