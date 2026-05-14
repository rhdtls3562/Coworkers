/**
 * 기존 팀 초대 링크 경로를 현재 참여 페이지 경로로 연결하는 호환 라우트입니다.
 */

import { redirect } from 'next/navigation';

import { buildJoinTeamLink } from '@/app/(service)/jointeam/utils/buildJoinTeamLink';
import { ROUTES } from '@/constants/ROUTES';

type InvitePageProps = {
  searchParams: Promise<{
    groupId?: string;
    token?: string;
  }>;
};

export default async function InvitePage({ searchParams }: InvitePageProps) {
  const { groupId, token } = await searchParams;

  if (!token) {
    redirect(ROUTES.JOIN_TEAM);
  }

  redirect(
    buildJoinTeamLink({
      groupId,
      token,
    }),
  );
}
