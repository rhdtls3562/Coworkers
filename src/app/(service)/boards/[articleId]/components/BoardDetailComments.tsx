'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';

import BoardDetailCommentComposer from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentComposer';
import BoardDetailCommentItem from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentItem';
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

export default function BoardDetailComments({
  commentCount,
  userProfile,
}: {
  commentCount: number;
  userProfile: UserProfileResponse | null;
}) {
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

  return (
    <div className="pb-9.75 md:pb-13.5">
      <div>
        <div className="flex items-center gap-1">
          <p className="text-base font-bold text-text-primary md:text-lg">
            댓글
          </p>
          <p className="text-base font-bold text-brand-primary md:text-lg">
            {commentCount}
          </p>
        </div>
        <BoardDetailCommentComposer
          articleId={articleId}
          isAuthenticated={isAuthenticated}
          onCreateSuccess={handleCommentMutated}
          onRequireAuth={handleRequireAuth}
          userProfile={userProfile}
        />
      </div>
      <div>
        {hasVisibleComments ? (
          <div className="mt-7 md:mt-9">
            <ul>
              {sortedComments.map((comment) => (
                <BoardDetailCommentItem
                  key={comment.id}
                  articleId={articleId}
                  comment={comment}
                  currentUserId={userProfile?.id}
                  onDeleteSuccess={handleCommentMutated}
                />
              ))}
            </ul>
            {hasNextPage ? (
              <div
                ref={sentinelRef}
                aria-hidden
                className="pointer-events-none mt-4 h-2 w-full shrink-0"
              />
            ) : null}
          </div>
        ) : (
          <div className="pt-5 border-t border-background-tertiary mt-7 md:mt-9">
            <p className="text-sm font-normal text-text-default text-center py-12.5 md:py-20 lg:py-12.5">
              아직 작성된 댓글이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
