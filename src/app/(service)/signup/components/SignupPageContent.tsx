/**
 * 회원가입 페이지의 전체 배치를 렌더링하는 컴포넌트입니다.
 */

import SignupForm from '@/app/(service)/signup/components/SignupForm';

type SignupPageContentProps = {
  redirectTo?: string;
};

export default function SignupPageContent({
  redirectTo,
}: SignupPageContentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-4 py-10">
      <SignupForm redirectTo={redirectTo} />
    </div>
  );
}
