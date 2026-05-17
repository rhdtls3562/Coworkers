'use client';

/**
 * 게시판 검색어 상태와 URL 쿼리 동기화를 담당하는 훅입니다.
 * 입력 중에는 로컬 state만 즉시 반영하고, 300ms debounce 후 router.replace로 URL을 갱신합니다.
 * Enter 제출 시에는 router.push로 즉시 이동해 브라우저 히스토리에 기록합니다.
 * 브라우저 뒤로 가기/앞으로 가기 시 searchParams 변화를 감지해 keyword 상태를 동기화합니다.
 */

import { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import type { BoardListSortValue } from '@/app/(service)/boards/types';
import { buildBoardListQueryString } from '@/app/(service)/boards/utils/boardListUtils';
import { ROUTES } from '@/constants/ROUTES';
import useDebounce from '@/hooks/useDebounce';

/** 실시간 검색 debounce 지연 시간 (ms) */
const SEARCH_DEBOUNCE_DELAY = 300;

type UseBoardSearchParams = {
  listSort: BoardListSortValue;
};

export default function useBoardSearch({ listSort }: UseBoardSearchParams) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(
    () => searchParams.get('keyword') ?? '',
  );

  const debouncedKeyword = useDebounce(keyword, SEARCH_DEBOUNCE_DELAY);

  /**
   * 브라우저 뒤로 가기/앞으로 가기 시 popstate 이벤트를 통해 URL의 keyword를 로컬 state에 반영합니다.
   * router.replace/push로 인한 URL 변화는 popstate를 발생시키지 않으므로 불필요한 state 갱신을 방지합니다.
   */
  useEffect(() => {
    const handlePopstate = () => {
      const params = new URLSearchParams(window.location.search);
      setKeyword(params.get('keyword') ?? '');
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, []);

  /**
   * 마운트 시 초기 렌더에서 불필요한 replace가 발생하지 않도록 합니다.
   */
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    router.replace(
      `${ROUTES.BOARDS}${buildBoardListQueryString({
        keyword: debouncedKeyword.trim() || undefined,
        sort: listSort,
      })}`,
    );
  }, [debouncedKeyword, listSort, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  /**
   * Enter 제출 시 debounce 대기 없이 즉시 검색하고 히스토리에 기록합니다.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(
      `${ROUTES.BOARDS}${buildBoardListQueryString({
        keyword: keyword.trim() || undefined,
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
