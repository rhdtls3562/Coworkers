'use client';

/**
 * 게시판 정렬 옵션 상태와 최신순·좋아요순 정렬된 게시글 목록을 메모이제이션하는 훅입니다.
 */

import { useMemo, useState } from 'react';

import { BOARD_SORT_VALUE } from '@/app/(service)/boards/constants';
import type { Post } from '@/app/(service)/boards/types';

export default function useSortedBoardPostsMemo({
  boardPosts,
}: {
  boardPosts: Post[];
}) {
  const [sort, setSort] = useState(BOARD_SORT_VALUE.LATEST);

  const sortedPosts = useMemo(() => {
    const postsCopy = [...boardPosts];

    if (sort === BOARD_SORT_VALUE.LATEST) {
      return postsCopy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    if (sort === BOARD_SORT_VALUE.LIKES) {
      return postsCopy.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
    }

    return postsCopy;
  }, [sort, boardPosts]);

  return {
    sortedPosts,
    sort,
    setSort,
  };
}
