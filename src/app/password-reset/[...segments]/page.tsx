/**
 * 기존 메일 링크의 경로 세그먼트 변형도 처리하는 비밀번호 재설정 별칭 페이지입니다.
 */

import ResetPasswordPageContent from '@/app/(service)/reset-password/components/ResetPasswordPageContent';

type PasswordResetCatchAllPageProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function PasswordResetCatchAllPage({
  params,
  searchParams,
}: PasswordResetCatchAllPageProps) {
  const [{ segments }, { token }] = await Promise.all([params, searchParams]);

  return <ResetPasswordPageContent token={token ?? segments.at(-1)} />;
}
