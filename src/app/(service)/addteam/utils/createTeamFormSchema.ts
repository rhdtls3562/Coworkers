/**
 * 팀 생성하기 폼에서 사용하는 검증 스키마와 값 타입입니다.
 */

import { z } from 'zod';

import { TEAM_NAME_MAX_LENGTH } from '@/constants/team';

export const createTeamFormSchema = z.object({
  teamImage: z.custom<File | null>().optional(),
  teamName: z
    .string()
    .trim()
    .min(1, '팀 이름을 입력해주세요.')
    .refine(
      (value) => !/^\d+$/.test(value),
      '숫자로만 이루어진 팀 이름은 사용할 수 없습니다.',
    )
    .refine(
      (value) => !/[^a-zA-Z0-9가-힣\s]/.test(value),
      '특수기호가 포함된 이름은 사용할 수 없습니다.',
    )
    .refine(
      (value) => value.length <= TEAM_NAME_MAX_LENGTH,
      `${TEAM_NAME_MAX_LENGTH}자 이내로 작성해 주세요.`,
    ),
});

export type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>;
