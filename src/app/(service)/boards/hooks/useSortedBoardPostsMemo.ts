'use client';

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
