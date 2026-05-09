'use client';

import { use, useState } from 'react';

import { useRouter } from 'next/navigation';

import { TeamDetailData, TeamPageProps } from '@/app/(service)/[teamid]/types';
import AddUserImg from '@/components/common/adduserimg/AddUserImg';
import { Input } from '@/components/common/form';
import { useToast } from '@/components/common/toast';
import { useUploadImageMutation } from '@/hooks/useImage';
import { useTeamDetailQuery, useUpdateTeamMutation } from '@/hooks/useTeam';

export default function EditTeamPage({ params }: TeamPageProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const { teamid } = use(params);

  const { data: teamData } = useTeamDetailQuery<TeamDetailData>({
    teamId: teamid,
  });
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeamMutation();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation();

  const [teamName, setTeamName] = useState(teamData?.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!teamData) return null;

  const isPending = isUpdating || isUploading;

  const handleEditTeam = async () => {
    let imageUrl = teamData.image;

    if (imageFile) {
      const result = await uploadImage({ file: imageFile });
      imageUrl = result.url;
    }

    updateTeam(
      { teamId: teamid, body: { name: teamName, image: imageUrl } },
      {
        onSuccess: () => {
          showToast('팀 정보가 수정 되었습니다.', 'success');
          router.push(`/${teamData.id}`);
        },
        onError: () => {
          showToast('팀 정보 수정에 실패했습니다.', 'error');
        },
      },
    );
  };

  return (
    <section className="px-4 py-25 md:px-14 flex justify-around items-center h-full">
      <div className="bg-background-primary px-6 pt-10 pb-15 rounded-[20px] w-full max-w-xl md:px-11">
        <h2 className="text-text-primary font-bold text-xl mb-8">
          팀 이름 변경하기
        </h2>
        <h2 className="sr-only">팀 정보 수정</h2>
        <form className="flex flex-col gap-3">
          <AddUserImg src={teamData.image} onChangeFile={setImageFile} />
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
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
        </form>
        <button
          className="text-base text-text-inverse bg-brand-primary w-full h-12 rounded-xl mb-5 hover:bg-interaction-hover disabled:opacity-50"
          disabled={isPending}
          onClick={handleEditTeam}
        >
          {isPending ? '수정 중...' : '수정하기'}
        </button>
        <p className="text-sm text-text-default font-normal text-center break-keep">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </p>
      </div>
    </section>
  );
}
