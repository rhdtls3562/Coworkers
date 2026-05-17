'use client';

import { useState } from 'react';

import PasswordModal from '@/app/(service)/mypage/components/PasswordModal';
import { useAccountForm } from '@/app/(service)/mypage/hook/useAccountForm';
import type { AccountFormProps } from '@/app/(service)/mypage/types';
import AddUserImg from '@/components/common/adduserimg/AddUserImg';
import { Input } from '@/components/common/form';

export default function AccountForm({
  isDirty,
  onDirtyChange,
  userInfo,
  onSubmitData,
  onSubmitError,
}: AccountFormProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    email,
    errors,
    handleImageChange,
    handleNameChange,
    handleSubmit,
    imageResetKey,
    nameRegister,
    onSubmit,
  } = useAccountForm({
    initialEmail: userInfo.email ?? '',
    initialName: userInfo.nickname ?? '',
    initialImage: userInfo.image ?? null,
    isDirty,
    onDirtyChange,
    onSubmitData,
  });

  const isSocialUser = /^.+@(KAKAO|GOOGLE)\.com$/i.test(userInfo.email ?? '');

  return (
    <>
      <form
        id="accountForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <AddUserImg
          key={imageResetKey}
          cropShape="rect"
          src={userInfo.image ?? undefined}
          onChangeFile={handleImageChange}
        />

        <div className="flex flex-col gap-3">
          <label htmlFor="userName">이름</label>

          <Input id="userName" {...nameRegister} onChange={handleNameChange} />

          {errors.nickname?.message && (
            <p className="text-sm font-medium text-status-danger">
              {errors.nickname.message}
            </p>
          )}

          {onSubmitError && (
            <p className="text-sm font-medium text-status-danger">
              {onSubmitError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="userEmail">이메일</label>

          <Input id="userEmail" value={email} disabled />
        </div>

        {!isSocialUser && (
          <div className="flex flex-row items-center gap-4">
            <label
              htmlFor="userPassword"
              className="w-fit text-sm font-medium text-text-primary"
            >
              비밀번호
            </label>
            <button
              id="userPassword"
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="h-8 w-fit rounded-lg border border-brand-primary bg-text-inverse px-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary"
            >
              비밀번호 변경하기
            </button>
          </div>
        )}
      </form>

      {isPasswordModalOpen && (
        <PasswordModal onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </>
  );
}
