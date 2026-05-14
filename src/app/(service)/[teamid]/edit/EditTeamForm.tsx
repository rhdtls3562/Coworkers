'use client';

/**
 * 팀 이름과 이미지를 수정하는 폼 컴포넌트 파일입니다.
 */

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { TeamDetailData } from '@/app/(service)/[teamid]/types';
import AddUserImg from '@/components/common/adduserimg/AddUserImg';
import { PrimaryButton } from '@/components/common/button';
import { Input } from '@/components/common/form';
import { useToast } from '@/components/common/toast';
import { TEAM_NAME_MAX_LENGTH } from '@/constants/team';
import { useUploadImageMutation } from '@/hooks/useImage';
import { useUpdateTeamMutation } from '@/hooks/useTeam';

type EditTeamFormProps = {
  teamData: TeamDetailData;
  teamid: string;
};

export default function EditTeamForm({ teamData, teamid }: EditTeamFormProps) {
  const { showToast } = useToast();
  const router = useRouter();

  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeamMutation();

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation();

  const [teamName, setTeamName] = useState(teamData.name);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isPending = isUpdating || isUploading;
  const isOverTeamNameLimit = teamName.trim().length > TEAM_NAME_MAX_LENGTH;
  const isChanged = teamName.trim() !== teamData.name || imageFile !== null;
  const isDisabled =
    isPending ||
    teamName.trim().length === 0 ||
    isOverTeamNameLimit ||
    !isChanged;

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (isDisabled) return;

    let imageUrl = teamData.image;

    if (imageFile) {
      const result = await uploadImage({ file: imageFile });
      imageUrl = result.url;
    }

    updateTeam(
      {
        teamId: teamid,
        body: {
          name: teamName,
          image: imageUrl,
        },
      },
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
    <div className="flex h-full items-center justify-center px-4 py-24 md:px-14">
      <div className="w-full max-w-xl rounded-[20px] bg-background-primary p-11">
        <h2 className="mb-8 text-xl font-bold text-text-primary">
          팀 이름 변경하기
        </h2>

        <h2 className="sr-only">팀 정보 수정</h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-3">
            <AddUserImg src={teamData.image} onChangeFile={setImageFile} />
          </div>

          <div className="mb-10 flex flex-col gap-3">
            <label
              htmlFor="teamName"
              className="text-base font-medium text-text-primary"
            >
              팀 이름
            </label>

            <Input
              id="teamName"
              maxLength={TEAM_NAME_MAX_LENGTH}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            {isOverTeamNameLimit && (
              <p className="text-sm font-medium text-status-danger">
                {TEAM_NAME_MAX_LENGTH}자 이내로 작성해 주세요.
              </p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            disabled={isDisabled}
            className="mb-5 max-w-none"
          >
            {isPending ? '수정 중...' : '수정하기'}
          </PrimaryButton>
        </form>

        <p className="break-keep text-center text-sm font-normal text-text-default">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </p>
      </div>
    </div>
  );
}
