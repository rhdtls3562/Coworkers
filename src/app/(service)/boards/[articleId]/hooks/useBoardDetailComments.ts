'use client';

/**
 * 게시글 상세 댓글 무한 조회·스크롤·정렬 및 비로그인 시 로그인 유도를 묶는 훅입니다.
 */

import { useParams, usePathname, useRouter } from 'next/navigation';

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import { useSortedComments } from '@/app/(service)/boards/[articleId]/hooks/useSortedComments';
import type {
  Comment,
  UserProfileResponse,
} from '@/app/(service)/boards/[articleId]/types';
import { useInfinitePages } from '@/app/(service)/boards/hooks/useInfinitePages';
import { useInfiniteScrollObserver } from '@/app/(service)/boards/hooks/useInfiniteScrollObserver';
import { useArticleCommentsInfiniteQuery } from '@/hooks/useArticleComment';
import { buildLoginPath } from '@/utils/authRedirect';

type UseBoardDetailCommentsParams = {
  userProfile: UserProfileResponse | null;
};

export function useBoardDetailComments({
  userProfile,
}: UseBoardDetailCommentsParams) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ articleId: string }>();
  const articleId = Number(params.articleId);
  const isValidArticleId = Number.isFinite(articleId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArticleCommentsInfiniteQuery({
      articleId,
      options: {
        enabled: isValidArticleId,
      },
      teamId: TEAM_ID,
    });

  const comments = useInfinitePages<Comment>({ pages: data?.pages });
  const sortedComments = useSortedComments({
    comments,
    userId: userProfile?.id,
  });
  const hasVisibleComments = sortedComments.length > 0;

  const sentinelRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const isAuthenticated = Boolean(userProfile);
  const currentUserId = userProfile?.id;

  const handleCommentMutated = () => {
    router.refresh();
  };

  const handleRequireAuth = () => {
    if (isAuthenticated) {
      return;
    }

    router.push(
      buildLoginPath({
        notice: 'auth-required',
        redirectTo: pathname,
      }),
    );
  };

  return {
    articleId,
    currentUserId,
    handleCommentMutated,
    handleRequireAuth,
    hasNextPage,
    hasVisibleComments,
    isAuthenticated,
    sentinelRef,
    sortedComments,
  };
}
