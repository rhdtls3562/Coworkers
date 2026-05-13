'use client';

import BoardDetailCommentComposer from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentComposer';
import BoardDetailCommentItem from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentItem';
import { useBoardDetailComments } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailComments';
import type { BoardDetailCommentsProps } from '@/app/(service)/boards/[articleId]/types';

export default function BoardDetailComments({
  commentCount,
  userProfile,
}: BoardDetailCommentsProps) {
  const {
    articleId,
    currentUserId,
    handleCommentMutated,
    handleRequireAuth,
    hasNextPage,
    hasVisibleComments,
    isAuthenticated,
    sentinelRef,
    sortedComments,
  } = useBoardDetailComments({ userProfile });

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
                  currentUserId={currentUserId}
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
