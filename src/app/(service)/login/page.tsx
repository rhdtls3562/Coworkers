/**
 * 로그인 페이지를 구성하는 파일입니다.
 */

import LoginPageContent from '@/app/(service)/login/components/LoginPageContent';

type LoginPageProps = {
  searchParams: Promise<{
    email?: string;
    notice?: 'auth-required';
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { email, notice, redirectTo } = await searchParams;

  return (
    <LoginPageContent
      loginNotice={notice}
      prefilledEmail={email}
      redirectTo={redirectTo}
    />
  );
}
