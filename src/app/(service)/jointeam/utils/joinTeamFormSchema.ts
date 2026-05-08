/**
 * 팀 참여하기 폼에서 사용하는 검증 스키마와 값 타입입니다.
 */

import { z } from 'zod';

import { extractInvitationToken } from '@/app/(service)/jointeam/utils/extractInvitationToken';

export const joinTeamFormSchema = z.object({
  teamLink: z
    .string()
    .trim()
    .min(1, '팀 링크를 입력해주세요.')
    .refine(
      (value) => Boolean(extractInvitationToken(value)),
      '유효한 팀 링크를 입력해주세요.',
    ),
});

export type JoinTeamFormValues = z.infer<typeof joinTeamFormSchema>;
