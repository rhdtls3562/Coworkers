'use client';

import { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { accountSchema } from '@/app/(service)/mypage/schemas/accountSchema';
import {
  AccountFormValues,
  UseAccountFormProps,
} from '@/app/(service)/mypage/types';
import { useToast } from '@/components/common/toast';

export function useAccountForm({
  initialEmail,
  initialName,
  isDirty,
  onDirtyChange,
}: UseAccountFormProps) {
  const { showToast, removeToast } = useToast();
  const toastIdRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialName,
    },
  });

  useEffect(() => {
    if (isDirty) {
      return;
    }

    reset({ name: initialName });
  }, [initialName, isDirty, reset]);

  const name = useWatch({
    control,
    name: 'name',
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register('name').onChange(e);

    const changed = e.target.value !== initialName;

    if (changed && !isDirty) {
      toastIdRef.current = showToast(
        '저장하지 않은 변경사항이 있어요!',
        'error',
        {
          hideCloseButton: true,
          label: '변경사항 취소하기',
          textClassName: 'text-status-danger',
          onClick: () => {
            reset({ name: initialName });
            onDirtyChange(false);
          },
        },
      );

      onDirtyChange(true);
    }

    if (!changed && isDirty) {
      if (toastIdRef.current) {
        removeToast(toastIdRef.current);
      }

      onDirtyChange(false);
    }
  };

  const onSubmit = (data: AccountFormValues) => {
    console.log(data);

    if (toastIdRef.current) {
      removeToast(toastIdRef.current);
    }

    onDirtyChange(false);
  };

  return {
    email: initialEmail,
    name,
    errors,
    register,
    handleSubmit,
    handleNameChange,
    onSubmit,
  };
}
