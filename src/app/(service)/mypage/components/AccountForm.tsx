'use client';

import { useState } from 'react';

import PasswordModal from '@/app/(service)/mypage/components/PasswordModal';
import { useAccountForm } from '@/app/(service)/mypage/hook/useAccountForm';
import type { AccountFormProps } from '@/app/(service)/mypage/types';
import AddUserImg from '@/components/common/adduserimg/AddUserImg';
import { Input } from '@/components/common/form';
import { useMeQuery } from '@/hooks/useUser';

type MeResponse = {
  email?: string;
  image?: string | null;
  nickname?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toMeResponse(data: unknown): MeResponse {
  if (!isRecord(data)) {
    return {};
  }

  const candidate = isRecord(data.data) ? data.data : data;

  return {
    email: typeof candidate.email === 'string' ? candidate.email : undefined,
    image:
      typeof candidate.image === 'string' || candidate.image === null
        ? candidate.image
        : undefined,
    nickname:
      typeof candidate.nickname === 'string' ? candidate.nickname : undefined,
  };
}

export default function AccountForm({
  isDirty,
  onDirtyChange,
}: AccountFormProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { data: meResponse } = useMeQuery();
  const me = toMeResponse(meResponse);

  const {
    email,
    name,
    errors,
    register,
    handleSubmit,
    handleNameChange,
    onSubmit,
  } = useAccountForm({
    initialEmail: me.email ?? '',
    initialName: me.nickname ?? '',
    isDirty,
    onDirtyChange,
  });

  return (
    <>
      <form
        id="accountForm"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <AddUserImg src={me.image ?? undefined} />

        <div className="flex flex-col gap-3">
          <label htmlFor="userName">이름</label>

          <Input
            id="userName"
            value={name}
            {...register('name')}
            onChange={handleNameChange}
          />

          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="userEmail">이메일</label>
          <Input id="userEmail" value={email} disabled />
        </div>

        <div className="flex flex-row gap-4 items-center">
          <label
            htmlFor="userPassword"
            className="text-text-primary text-sm font-medium w-fit"
          >
            비밀번호
          </label>
          <button
            id="userPassword"
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-text-inverse text-brand-primary border border-brand-primary text-sm font-semibold rounded-lg h-8  w-fit px-2 hover:bg-brand-secondary"
          >
            비밀번호 변경하기
          </button>
        </div>
      </form>

      {isPasswordModalOpen && (
        <PasswordModal onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </>
  );
}
