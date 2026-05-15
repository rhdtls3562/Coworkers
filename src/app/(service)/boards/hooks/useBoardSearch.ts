'use client';

/**
 * 게시판 검색어 상태와 제출 시 keyword 쿼리로 라우팅하는 훅입니다.
 */

import { useState } from 'react';

import { useRouter } from 'next/navigation';

export default function useBoardSearch() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword.trim()) {
      router.push('/boards');
      return;
    }

    router.push(`/boards?keyword=${encodeURIComponent(keyword)}`);
  };

  return {
    keyword,
    handleChange,
    handleSubmit,
  };
}
