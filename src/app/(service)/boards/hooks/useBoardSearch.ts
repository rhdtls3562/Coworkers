'use client';

/**
 * 게시판 검색어 상태와 제출 시 keyword 쿼리로 라우팅하는 훅 모음
 */

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import type { BoardListSortValue } from '@/app/(service)/boards/types';
import { buildBoardListQueryString } from '@/app/(service)/boards/utils/boardListUtils';
import { ROUTES } from '@/constants/ROUTES';

type UseBoardSearchParams = {
  listSort: BoardListSortValue;
};

export default function useBoardSearch({ listSort }: UseBoardSearchParams) {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!keyword.trim()) {
      router.push(
        `${ROUTES.BOARDS}${buildBoardListQueryString({ sort: listSort })}`,
      );
      return;
    }

    router.push(
      `${ROUTES.BOARDS}${buildBoardListQueryString({
        keyword,
        sort: listSort,
      })}`,
    );
  };

  return {
    keyword,
    handleChange,
    handleSubmit,
  };
}
