'use client';

/**
 * 팀 생성하기 페이지를 구성하는 파일입니다.
 */

import { useCreateTeamForm } from '@/app/(service)/addteam/hooks/useCreateTeamForm';
import AddUserImg from '@/components/common/adduserimg/AddUserImg';
import { PrimaryButton } from '@/components/common/button';
import { Input } from '@/components/common/form';
import { TEAM_NAME_MAX_LENGTH } from '@/constants/team';
import { cn } from '@/utils/cn';

export default function CreateTeamPage() {
  const {
    errorMessage,
    isDisabled,
    handleChangeFile,
    handleSubmit,
    teamNameField,
  } = useCreateTeamForm();

  return (
    <div className="flex h-full items-center justify-center px-4 py-24 md:px-14">
      <div className="w-full max-w-xl rounded-[20px] bg-background-primary p-11">
        <h2 className="mb-8 text-xl font-bold text-text-primary">
          팀 생성하기
        </h2>

        <h2 className="sr-only">팀 정보 입력</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-3">
            <AddUserImg onChangeFile={handleChangeFile} />
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
              placeholder="팀 이름을 입력해주세요."
              aria-invalid={Boolean(errorMessage)}
              className={cn(
                errorMessage &&
                  'border-status-danger focus:border-status-danger',
              )}
              {...teamNameField}
            />

            {errorMessage && (
              <p className="text-sm font-medium text-status-danger">
                {errorMessage}
              </p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            disabled={isDisabled}
            className="mb-5 max-w-none"
          >
            생성하기
          </PrimaryButton>
        </form>

        <p className="break-keep text-center text-sm font-normal text-text-default">
          팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
        </p>
      </div>
    </div>
  );
}
