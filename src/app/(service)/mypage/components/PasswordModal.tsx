'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { passwordSchema } from '@/app/(service)/mypage/schemas/passwordSchema';
import { Input } from '@/components/common/form';
import Modal from '@/components/common/modal';
import { useToast } from '@/components/common/toast';

type Props = {
  onClose: () => void;
};

export default function PasswordModal({ onClose }: Props) {
  const { showToast } = useToast();

  const handleConfirm = () => {
    showToast('비밀번호가 변경되었습니다.', 'success');

    onClose();
  };

  const {
    register,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  });
  return (
    <Modal
      onClose={onClose}
      title="비밀번호 변경하기"
      hasCloseButton={false}
      lineButtonText="닫기"
      onLineButtonClick={onClose}
      primaryButtonText="변경하기"
      onPrimaryButtonClick={handleConfirm}
      isPrimaryButtonDisabled={!isValid}
    >
      <form className="text-left flex flex-col gap-6 min-w-70">
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="newPassword"
            className="text-text-primary text-sm font-medium"
          >
            새 비밀번호
          </label>
          <Input
            {...register('currentPassword')}
            id="newPassword"
            type="password"
            placeholder="새 비밀번호를 입력해주세요."
          />
          {errors.currentPassword && (
            <p className="text-status-danger text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 relative">
          <label
            htmlFor="confirmPassword"
            className="text-text-primary text-sm font-medium"
          >
            새 비밀번호 확인
          </label>
          <Input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
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
