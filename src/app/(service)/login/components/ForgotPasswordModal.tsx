'use client';

import useForgotPasswordForm from '@/app/(service)/login/hooks/useForgotPasswordForm';
import { AuthInput } from '@/components/common/form';
import Modal from '@/components/common/modal';

type ForgotPasswordModalProps = {
  onClose: () => void;
};

export default function ForgotPasswordModal({
  onClose,
}: ForgotPasswordModalProps) {
  const { emailError, emailField, handleSubmit, isDisabled, serverError } =
    useForgotPasswordForm({
      onSuccess: onClose,
    });

  return (
    <Modal
      hasCloseButton={false}
      title="비밀번호를 잊으셨나요?"
      description={`가입한 이메일을 입력하시면\n 비밀번호 재설정 링크를 보내드립니다.`}
      lineButtonText="닫기"
      primaryButtonText="링크 보내기"
      isPrimaryButtonDisabled={isDisabled}
      onClose={onClose}
      onLineButtonClick={onClose}
      onPrimaryButtonClick={handleSubmit}
    >
      <div className="mt-4 w-full text-left">
        <AuthInput
          label="이메일"
          type="email"
          autoComplete="email"
          errorMessage={emailError}
          placeholder="이메일을 입력해주세요"
          {...emailField}
        />
        {serverError && (
          <p className="mt-3 text-center text-sm font-medium text-status-danger">
            {serverError}
          </p>
        )}
      </div>
    </Modal>
  );
}
