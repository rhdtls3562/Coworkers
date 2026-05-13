'use client';

/**
 * 베스트 게시글 그리드 표시 여부와 빈 목록 안내 문구를 메모이제이션하는 훅입니다.
 */

import { useMemo } from 'react';

import type { Post } from '@/app/(service)/boards/types';

export default function useBestPostsMemo({
  boardBestPosts,
  hasBoardPosts,
}: {
  boardBestPosts: Post[];
  hasBoardPosts: boolean;
}) {
  const showBestGrid = useMemo(() => {
    if (!hasBoardPosts) {
      return false;
    }

    return boardBestPosts.some((post) => (post.likeCount ?? 0) > 0);
  }, [boardBestPosts, hasBoardPosts]);

  const emptyMessage = useMemo(() => {
    if (showBestGrid) {
      return null;
    }

    if (!hasBoardPosts) {
      return '아직 등록된 게시글이 없어요.';
    }

    return '아직 좋아요가 달린 인기 게시글이 없어요.';
  }, [hasBoardPosts, showBestGrid]);
  return {
    emptyMessage,
  };
}
