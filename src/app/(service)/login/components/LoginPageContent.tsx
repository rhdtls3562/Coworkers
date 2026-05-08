/**
 * 로그인 페이지의 전체 배치를 렌더링하는 컴포넌트입니다.
 */

import LoginForm from '@/app/(service)/login/components/LoginForm';

type LoginPageContentProps = {
  prefilledEmail?: string;
  redirectTo?: string;
};

export default function LoginPageContent({
  prefilledEmail,
  redirectTo,
}: LoginPageContentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-4 py-10">
      <LoginForm prefilledEmail={prefilledEmail} redirectTo={redirectTo} />
    </div>
  );
}
