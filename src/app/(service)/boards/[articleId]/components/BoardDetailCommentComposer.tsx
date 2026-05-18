/**
 * 게시글 상세 댓글 입력 영역을 렌더링하는 컴포넌트입니다.
 */

'use client';

import BoardDetailCommentComposerProfileAvatar from '@/app/(service)/boards/[articleId]/components/BoardDetailCommentComposerProfileAvatar';
import { useBoardDetailCommentComposer } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailCommentComposer';
import type { UserProfileResponse } from '@/app/(service)/boards/[articleId]/types';
import { getBoardImageRemountKey } from '@/app/(service)/boards/utils/boardImageKeys';
import { IcArrowUpCircle, IcArrowUpCircleActive } from '@/assets';
import { COMMENT_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

type BoardDetailCommentComposerProps = {
  articleId: number;
  isAuthenticated: boolean;
  onCreateSuccess: () => void;
  onRequireAuth: () => void;
  userProfile: UserProfileResponse | null;
};

export default function BoardDetailCommentComposer({
  articleId,
  isAuthenticated,
  onCreateSuccess,
  onRequireAuth,
  userProfile,
}: BoardDetailCommentComposerProps) {
  const {
    draft,
    setDraft,
    handleKeyDown,
    handleSubmit,
    isButtonDisabled,
    isSubmitEnabled,
  } = useBoardDetailCommentComposer({
    articleId,
    isAuthenticated,
    onCreateSuccess,
    onRequireAuth,
  });

  const isCommentAtLimit = draft.length >= COMMENT_TEXT_LIMIT;
  return (
    <div className="flex min-w-0 items-center gap-3 mt-3 md:mt-4 md:gap-4">
      <div className="overflow-hidden size-7 rounded-md bg-background-tertiary flex items-center justify-center md:size-8">
        <BoardDetailCommentComposerProfileAvatar
          key={getBoardImageRemountKey(userProfile?.image)}
          image={userProfile?.image ?? null}
          nickname={userProfile?.nickname ?? ''}
          isGuest={!userProfile}
        />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 border-y border-background-tertiary px-3 py-2 md:gap-3 md:py-3">
        <input
          type="text"
          name="comment"
          readOnly={!isAuthenticated}
          value={isAuthenticated ? draft : ''}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={isAuthenticated ? handleKeyDown : undefined}
          maxLength={COMMENT_TEXT_LIMIT}
          placeholder={
            isAuthenticated
              ? '댓글을 달아주세요'
              : '댓글을 남기려면 로그인해주세요'
          }
          className="min-w-0 max-w-full flex-1 border-0 bg-transparent text-sm font-normal text-text-primary outline-none placeholder:text-text-default placeholder:text-sm"
          onClick={!isAuthenticated ? onRequireAuth : undefined}
          onFocus={!isAuthenticated ? onRequireAuth : undefined}
        />

        <button
          type="button"
          aria-label="댓글 등록"
          className="flex size-6 shrink-0 items-center justify-center disabled:opacity-50"
          disabled={isButtonDisabled}
          onClick={!isAuthenticated ? onRequireAuth : handleSubmit}
        >
          {isSubmitEnabled ? (
            <IcArrowUpCircleActive
              width={24}
              height={24}
              className="size-6"
              aria-hidden
            />
          ) : (
            <IcArrowUpCircle
              width={24}
              height={24}
              className="size-6"
              aria-hidden
            />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between mt-1">
        {isCommentAtLimit ? (
          <p className="text-left text-sm font-medium text-status-danger">
            {COMMENT_TEXT_LIMIT}자 이내로 작성해주세요.
          </p>
        ) : (
          <span />
        )}
        <p className="text-right text-sm text-text-default">
          {draft.length}/{COMMENT_TEXT_LIMIT}
        </p>
      </div>
    </div>
  );
}
