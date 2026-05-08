'use client';

import { usePathname, useRouter } from 'next/navigation';

import BoardDetailCommentComposer from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentComposer';
import BoardDetailCommentItem from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentItem';
import { useSortedComments } from '@/app/(service)/boards/[articleId]/hooks/useSortedComments';
import type {
  Comment,
  CommentListResponse,
  UserProfileResponse,
} from '@/app/(service)/boards/[articleId]/types';
import { buildLoginPath } from '@/utils/authRedirect';

export default function BoardDetailComments({
  commentList,
  userProfile,
}: {
  commentList: CommentListResponse;
  userProfile: UserProfileResponse | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sortedComments = useSortedComments({
    comments: commentList.list,
    userId: userProfile?.id,
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
            {commentList.list.length}
          </p>
        </div>
        <BoardDetailCommentComposer
          isAuthenticated={isAuthenticated}
          onRequireAuth={handleRequireAuth}
          userProfile={userProfile}
        />
      </div>
      <div>
        {commentList.list.length > 0 ? (
          <div className="mt-7 md:mt-9">
            <ul>
              {sortedComments.map((comment: Comment) => (
                <BoardDetailCommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={userProfile?.id}
                />
              ))}
            </ul>
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
