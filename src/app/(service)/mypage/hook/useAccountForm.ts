'use client';

/**
 * 계정 설정 폼의 입력, 이미지 업로드, 제출 흐름을 관리하는 훅입니다.
 */

import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import useAccountDirtyState from '@/app/(service)/mypage/hook/useAccountDirtyState';
import useAccountUnsavedChangesGuard from '@/app/(service)/mypage/hook/useAccountUnsavedChangesGuard';
import { accountSchema } from '@/app/(service)/mypage/schemas/accountSchema';
import type {
  AccountFormValues,
  UseAccountFormProps,
  UserInfo,
} from '@/app/(service)/mypage/types';
import { useToast } from '@/components/common/toast';
import { useUploadImageMutation } from '@/hooks/useImage';

export function useAccountForm({
  initialEmail,
  initialImage,
  initialName,
  isDirty,
  onDirtyChange,
  onSubmitData,
}: UseAccountFormProps) {
  const { showToast } = useToast();
  const uploadImageMutation = useUploadImageMutation();
  const { control, handleSubmit, register, reset } = useForm<AccountFormValues>(
    {
      defaultValues: {
        name: initialName,
      },
      mode: 'onChange',
      resolver: zodResolver(accountSchema),
    },
  );
  const resetName = useCallback(
    (name: string) => {
      reset({ name });
    },
    [reset],
  );
  const {
    baseImageRef,
    baseNameRef,
    checkIsDirty,
    handleDiscardChanges,
    imageRef,
    imageResetKey,
  } = useAccountDirtyState({
    initialImage,
    initialName,
    isDirty,
    onDirtyChange,
    resetName,
  });
  const name = useWatch({
    control,
    name: 'name',
  });

  useAccountUnsavedChangesGuard({
    hasUnsavedChanges: isDirty,
    onDiscardChanges: handleDiscardChanges,
  });

  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        const { url } = await uploadImageMutation.mutateAsync({ file });
        imageRef.current = url;
      } catch {
        showToast('이미지 업로드에 실패했습니다.', 'error');
        return;
      }
    } else {
      imageRef.current = null;
    }

    checkIsDirty(name);
  };

  const { onChange: onNameChange, ...nameRegister } = register('name');

  const handleNameChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await onNameChange(event);
    checkIsDirty(event.target.value);
  };

  const onSubmit = async (data: AccountFormValues) => {
    const payload: Partial<Pick<UserInfo, 'nickname' | 'image'>> = {};

    if (data.name !== baseNameRef.current) {
      payload.nickname = data.name;
    }

    if (imageRef.current !== baseImageRef.current) {
      payload.image = imageRef.current ?? undefined;
    }

    try {
      await onSubmitData(payload);
      baseNameRef.current = data.name;
      baseImageRef.current = imageRef.current;
      onDirtyChange(false);
    } catch {}
  };

  return {
    email: initialEmail,
    handleImageChange,
    handleNameChange,
    handleSubmit,
    imageResetKey,
    name,
    nameRegister,
    onSubmit,
  };
}
