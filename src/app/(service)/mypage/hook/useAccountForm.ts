'use client';

import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { uploadImage } from '@/api/imageApi';
import { accountSchema } from '@/app/(service)/mypage/schemas/accountSchema';
import {
  AccountFormValues,
  UseAccountFormProps,
  UserInfo,
} from '@/app/(service)/mypage/types';
import { useToast } from '@/components/common/toast';

export function useAccountForm({
  initialEmail,
  initialName,
  initialImage,
  isDirty,
  onDirtyChange,
  onSubmitData,
}: UseAccountFormProps) {
  const { showToast, removeToast } = useToast();
  const toastIdRef = useRef<string | null>(null);
  const imageRef = useRef<string | null>(initialImage ?? null);

  const baseNameRef = useRef<string>(initialName ?? '');
  const baseImageRef = useRef<string | null>(initialImage ?? null);
  const [imageResetKey, setImageResetKey] = useState(0);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    register,
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialName,
    },
  });

  useEffect(() => {
    if (isDirty) return;
    reset({ name: baseNameRef.current });
  }, [initialName, isDirty, reset]);

  const name = useWatch({
    control,
    name: 'name',
  });

  const checkIsDirty = (currentName: string) => {
    const nameChanged = currentName !== baseNameRef.current;
    const imageChanged = imageRef.current !== baseImageRef.current;
    const dirty = nameChanged || imageChanged;

    if (dirty && !isDirty) {
      toastIdRef.current = showToast(
        '저장하지 않은 변경사항이 있어요!',
        'error',
        {
          hideCloseButton: true,
          label: '변경사항 취소하기',
          textClassName: 'text-status-danger',
          onClick: () => {
            reset({ name: baseNameRef.current });
            imageRef.current = baseImageRef.current;
            setImageResetKey((prev) => prev + 1);
            onDirtyChange(false);
          },
        },
      );
    }

    if (!dirty && isDirty) {
      if (toastIdRef.current) removeToast(toastIdRef.current);
    }
    onDirtyChange(dirty);
  };

  const handleImageChange = async (file: File | null) => {
    if (file) {
      try {
        const { url } = await uploadImage(file);
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
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onNameChange(e);
    checkIsDirty(e.target.value);
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
      await onSubmitData(payload); // mutateAsync라 실패 시 throw함
      baseNameRef.current = data.name;
      baseImageRef.current = imageRef.current;
      if (toastIdRef.current) removeToast(toastIdRef.current);
      onDirtyChange(false);
    } catch {}
  };

  return {
    email: initialEmail,
    name,
    errors,
    register,
    handleSubmit,
    nameRegister,
    handleNameChange,
    handleImageChange,
    onSubmit,
    imageResetKey,
  };
}
