/**
 * 기존 메일 링크 호환을 위한 비밀번호 재설정 별칭 페이지입니다.
 */

import ResetPasswordPageContent from '@/app/(service)/reset-password/components/ResetPasswordPageContent';

type PasswordResetPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function PasswordResetPage({
  searchParams,
}: PasswordResetPageProps) {
  const { token } = await searchParams;

  return <ResetPasswordPageContent token={token} />;
}
