import { z } from 'zod';

export const accountSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, '이름은 2자 이상 입력해주세요.')
    .max(10, '이름은 10자 이하 입력해주세요.'),
});

export type AccountFormValues = z.infer<typeof accountSchema>;
