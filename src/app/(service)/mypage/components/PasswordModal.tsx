'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { passwordSchema } from '@/app/(service)/mypage/schemas/passwordSchema';
import { PasswordFormValues } from '@/app/(service)/mypage/types';
import { AuthInput } from '@/components/common/form';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';
import { useChangePasswordMutation } from '@/hooks/useUser';

type Props = {
  onClose: () => void;
};

export default function PasswordModal({ onClose }: Props) {
  const { showToast } = useToast();

  const handleConfirm = () => {
    showToast('비밀번호가 변경되었습니다.', 'success');

    onClose();
  };

  const { mutate: updatePassword } = useChangePasswordMutation({
    onSuccess: () => {
      handleConfirm();
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: PasswordFormValues) => {
    updatePassword({
      password: data.newPassword,
      passwordConfirmation: data.confirmPassword,
    });
  };

  return (
    <Modal
      onClose={onClose}
      title="비밀번호 변경하기"
      hasCloseButton={false}
      lineButtonText="닫기"
      onLineButtonClick={onClose}
      primaryButtonText="변경하기"
      onPrimaryButtonClick={handleSubmit(onSubmit)}
      isPrimaryButtonDisabled={!isValid}
    >
      <form className="text-left flex flex-col gap-6 min-w-70">
        <div className="flex flex-col gap-2 relative">
          <AuthInput
            {...register('newPassword')}
            id="newPassword"
            type="password"
            autoComplete="new-password"
            label="새 비밀번호"
            placeholder="새 비밀번호를 입력해주세요."
          />
          {errors.newPassword && (
            <p className="text-status-danger text-sm">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 relative">
          <AuthInput
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            label="새 비밀번호 확인"
            placeholder="새 비밀번호를 다시 한번 입력해주세요."
          />
          {errors.confirmPassword && (
            <p className="text-status-danger text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
