/**
 * 비밀번호 재설정 페이지를 구성하는 파일입니다.
 */

import ResetPasswordPageContent from '@/app/(service)/reset-password/components/ResetPasswordPageContent';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return <ResetPasswordPageContent token={token} />;
}
