/**
 * 게시글 상세 댓글 입력 영역을 렌더링하는 컴포넌트입니다.
 */

'use client';

import Image from 'next/image';

import { useBoardDetailCommentComposer } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailCommentComposer';
import type { UserProfileResponse } from '@/app/(service)/boards/[articleId]/types';
import { IcArrowUpCircle, IcUserXlarge } from '@/assets';

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
  const { draft, setDraft, handleSubmit, handleKeyDown, isCreatePending } =
    useBoardDetailCommentComposer({
      articleId,
      isAuthenticated,
      onCreateSuccess,
      onRequireAuth,
    });

  return (
    <div className="flex items-center gap-3 mt-3 md:mt-4 md:gap-4">
      <div className="overflow-hidden size-7 rounded-md bg-background-tertiary flex items-center justify-center md:size-8">
        {userProfile?.image ? (
          <Image
            src={userProfile.image}
            width={28}
            height={28}
            alt={`${userProfile.nickname}의 프로필 이미지`}
            className="size-7 object-cover md:size-8"
          />
        ) : (
          <IcUserXlarge
            width={28}
            height={28}
            className="size-7 md:size-8"
            role="img"
            aria-label={
              userProfile
                ? `${userProfile.nickname}의 프로필 이미지`
                : '게스트 프로필 이미지'
            }
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 border-y border-background-tertiary px-3 py-2 md:gap-3 md:py-3">
        <input
          type="text"
          readOnly={!isAuthenticated}
          value={isAuthenticated ? draft : ''}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={isAuthenticated ? handleKeyDown : undefined}
          placeholder={
            isAuthenticated
              ? '댓글을 달아주세요'
              : '댓글을 남기려면 로그인해주세요'
          }
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-normal text-text-primary outline-none placeholder:text-text-default placeholder:text-sm"
          onClick={!isAuthenticated ? onRequireAuth : undefined}
          onFocus={!isAuthenticated ? onRequireAuth : undefined}
        />
        <button
          type="button"
          aria-label="댓글 등록"
          className="flex size-6 shrink-0 items-center justify-center disabled:opacity-50"
          disabled={Boolean(isAuthenticated && isCreatePending)}
          onClick={!isAuthenticated ? onRequireAuth : handleSubmit}
        >
          <IcArrowUpCircle
            width={24}
            height={24}
            className="size-6"
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}
