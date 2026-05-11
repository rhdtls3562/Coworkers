'use client';

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
