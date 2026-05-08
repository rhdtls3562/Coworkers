'use client';
import { useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { getMe, updateMe } from '@/api/userApi';
import AccountForm from '@/app/(service)/mypage/components/AccountForm';
import WithdrawModal from '@/app/(service)/mypage/components/WithdrawModal';
import { IcLogout } from '@/assets/index';
import { PrimaryButton } from '@/components/common/button';

export default function MyPage() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: me } = useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: getMe,
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
      setSubmitError(null);
      // setIsDirty(false)는 훅 내부 onSubmit에서 처리
    },
    onError: (error) => {
      setSubmitError(error.message);
    },
  });

  if (!me) return null;

  return (
    <div className="w-full h-full min-h-dvh flex justify-center items-center gap-4 flex-wrap px-4 py-6 md:px-16 md:py-10">
      <div className="bg-background-inverse px-5.5 pt-12 pb-16 rounded-[20px] flex flex-col gap-8 w-full md:px-11 md:pt-16 xl:max-w-235 xl:px-14">
        <h2 className="text-text-primary text-[20px] font-bold">계정 설정</h2>
        <h2 className="sr-only">기본 계정 정보 수정</h2>
        <AccountForm
          isDirty={isDirty}
          onDirtyChange={setIsDirty}
          userInfo={me}
          onSubmitData={updateProfile}
          onSubmitError={submitError}
        />
        <div className="mt-1">
          <div className="flex justify-end">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex items-center gap-2 leading-none text-status-danger font-medium text-base"
            >
              <IcLogout
                width={15.75}
                height={12}
                className="shrink-0"
                role="img"
                aria-label="회원 탈퇴 아이콘"
              />
              회원 탈퇴하기
            </button>
          </div>
          <div className="flex justify-center items-center pt-10 m-w-70 m-auto w-full">
            <PrimaryButton form="accountForm" type="submit" disabled={!isDirty}>
              변경하기
            </PrimaryButton>
          </div>
          {isWithdrawModalOpen && (
            <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
