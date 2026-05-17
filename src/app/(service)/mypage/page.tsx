/** 마이페이지(계정 설정) 서버 컴포넌트입니다. */

import MyPageClient from '@/app/(service)/mypage/components/MyPageClient';

export const metadata = { title: '계정 설정' };

export default function MyPage() {
  return <MyPageClient />;
}
