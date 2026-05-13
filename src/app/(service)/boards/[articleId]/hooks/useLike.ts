'use client';

/**
 * 게시글 좋아요 토글 mutation과 좋아요 수·상태 로컬 동기화를 담당하는 훅입니다.
 */

import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import type { BoardDetailProps } from '@/app/(service)/boards/[articleId]/types';
import { useToast } from '@/components/common/toast';
import {
  useLikeArticleMutation,
  useUnlikeArticleMutation,
} from '@/hooks/useArticle';
import { buildLoginPath } from '@/utils/authRedirect';
import { getStoredAccessToken } from '@/utils/authSession';

export const useLike = (boardDetail: BoardDetailProps['boardDetail']) => {
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const [isLiked, setIsLiked] = useState(Boolean(boardDetail.isLiked));
  const [likeCount, setLikeCount] = useState(boardDetail.likeCount);

  const likeMutation = useLikeArticleMutation();
  const unlikeMutation = useUnlikeArticleMutation();

  const handleLikeClick = () => {
    if (!TEAM_ID) {
      showToast('팀 정보가 설정되지 않았습니다.', 'error');
      return;
    }

    const token = getStoredAccessToken();
    if (!token) {
      router.push(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo: pathname,
        }),
      );
      return;
    }

    if (likeMutation.isPending || unlikeMutation.isPending) {
      return;
    }

    const willLike = !isLiked;
    setIsLiked(willLike);
    setLikeCount((prev) => prev + (willLike ? 1 : -1));

    const mutation = willLike ? likeMutation : unlikeMutation;
    mutation.mutate(
      { articleId: boardDetail.id, teamId: TEAM_ID, token },
      {
        onError: () => {
          setIsLiked(!willLike);
          setLikeCount((prev) => prev + (willLike ? -1 : 1));
          showToast('좋아요 처리에 실패했습니다. 다시 시도해주세요.', 'error');
        },
      },
    );
  };

  return { isLiked, likeCount, handleLikeClick };
};
