/**
 * 경로 세그먼트가 포함된 비밀번호 재설정 메일 링크도 처리하는 호환 페이지입니다.
 */

import ResetPasswordPageContent from '@/app/(service)/reset-password/components/ResetPasswordPageContent';

type ResetPasswordCatchAllPageProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordCatchAllPage({
  params,
  searchParams,
}: ResetPasswordCatchAllPageProps) {
  const [{ segments }, { token }] = await Promise.all([params, searchParams]);

  return <ResetPasswordPageContent token={token ?? segments.at(-1)} />;
}
