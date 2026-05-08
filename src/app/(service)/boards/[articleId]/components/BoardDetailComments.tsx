'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

import BoardDetailCommentComposer from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentComposer';
import BoardDetailCommentItem from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentItem';
import { useSortedComments } from '@/app/(service)/boards/[articleId]/hooks/useSortedComments';
import type {
  Comment,
  UserProfileResponse,
} from '@/app/(service)/boards/[articleId]/types';
import { useInfinitePages } from '@/app/(service)/boards/hooks/useInfinitePages';
import { useInfiniteScrollObserver } from '@/app/(service)/boards/hooks/useInfiniteScrollObserver';
import { useArticleCommentsInfiniteQuery } from '@/hooks/useArticleComment';
import { buildLoginPath } from '@/utils/authRedirect';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function BoardDetailComments({
  userProfile,
}: {
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
  const sentinelRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });
  const isAuthenticated = Boolean(userProfile);

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
            {comments.length}
          </p>
        </div>
        <BoardDetailCommentComposer
          isAuthenticated={isAuthenticated}
          onRequireAuth={handleRequireAuth}
          userProfile={userProfile}
        />
      </div>
      <div>
        {comments.length > 0 ? (
          <div className="mt-7 md:mt-9">
            <ul>
              {sortedComments.map((comment) => (
                <BoardDetailCommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={userProfile?.id}
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
