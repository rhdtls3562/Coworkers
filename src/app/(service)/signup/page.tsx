/**
 * 회원가입 페이지를 구성하는 파일입니다.
 */

import SignupPageContent from '@/app/(service)/signup/components/SignupPageContent';

type SignupPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { redirectTo } = await searchParams;

  return <SignupPageContent redirectTo={redirectTo} />;
}
