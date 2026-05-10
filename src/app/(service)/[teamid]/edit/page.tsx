// page.tsx
'use client';

import { useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import AddUserImg from '@/components/common/adduserimg/AddUserImg';
import { Input } from '@/components/common/form';
import { useToast } from '@/components/common/toast';
import { useTeamDetailQuery, useUpdateTeamMutation } from '@/hooks/useTeam';

const API_TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function EditTeamPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams<{ teamid: string }>();
  const teamId = params.teamid;
  const { data: teamDetail } = useTeamDetailQuery({
    teamId,
  });
  const [draftTeamName, setDraftTeamName] = useState<string | null>(null);
  const updateTeamMutation = useUpdateTeamMutation();
  const teamName = draftTeamName ?? teamDetail?.name ?? '';

  const handleEditTeam = async () => {
    if (!teamName.trim()) {
      showToast('팀 이름을 입력해주세요.', 'error');
      return;
    }

    try {
      await updateTeamMutation.mutateAsync({
        body: { name: teamName.trim() },
        teamId: API_TEAM_ID,
      });
      showToast('팀 이름이 수정 되었습니다.', 'success');
      router.push(`/${teamId}`);
    } catch {
      showToast('팀 이름 수정에 실패했습니다.', 'error');
    }
  };
  return (
    <section className="px-4 py-25 md:px-14 flex justify-around items-center h-full">
      <div className="bg-background-primary px-6 pt-10 pb-15 rounded-[20px] w-full max-w-xl md:px-11">
        <h2 className="text-text-primary font-bold text-xl mb-8">
          팀 이름 변경하기
        </h2>
        <h2 className="sr-only">팀 정보 수정</h2>
        <form className="flex flex-col gap-3">
          <AddUserImg />
          <div className="flex flex-col gap-2 mb-10">
            <label
              htmlFor="teamName"
              className="text-sm text-text-primary font-medium"
            >
              팀 이름
            </label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(event) => setDraftTeamName(event.target.value)}
            />
          </div>
        </form>
        <button
          className="text-base text-text-inverse bg-brand-primary w-full h-12 rounded-xl mb-5 hover:bg-interaction-hover"
          onClick={handleEditTeam}
        >
          수정하기
        </button>
        <p className="text-sm text-text-default font-normal text-center break-keep">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </p>
      </div>
    </section>
  );
}
