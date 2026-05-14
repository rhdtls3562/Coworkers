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
  const { control, formState, handleSubmit, register, reset } =
    useForm<AccountFormValues>({
      defaultValues: {
        nickname: initialName,
      },
      mode: 'onChange',
      resolver: zodResolver(accountSchema),
    });
  const resetName = useCallback(
    (name: string) => {
      reset({ nickname: name });
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
    name: 'nickname',
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

  const { onChange: onNameChange, ...nameRegister } = register('nickname');

  const handleNameChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await onNameChange(event);
    checkIsDirty(event.target.value);
  };

  const onSubmit = useCallback(
    async (data: AccountFormValues) => {
      const payload: Partial<Pick<UserInfo, 'nickname' | 'image'>> = {};

      if (data.nickname !== baseNameRef.current) {
        payload.nickname = data.nickname;
      }

      if (imageRef.current !== baseImageRef.current) {
        payload.image = imageRef.current ?? undefined;
      }

      try {
        await onSubmitData(payload);
        baseNameRef.current = data.nickname;
        baseImageRef.current = imageRef.current;
        onDirtyChange(false);
      } catch {}
    },
    [baseNameRef, baseImageRef, imageRef, onSubmitData, onDirtyChange],
  );

  return {
    email: initialEmail,
    errors: formState.errors,
    handleImageChange,
    handleNameChange,
    handleSubmit,
    imageResetKey,
    name,
    nameRegister,
    onSubmit,
  };
}
