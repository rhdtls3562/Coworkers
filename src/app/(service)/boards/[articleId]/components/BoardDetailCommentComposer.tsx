/**
 * 게시글 상세 댓글 입력 영역을 렌더링하는 컴포넌트입니다.
 */

'use client';

import Image from 'next/image';

import type { UserProfileResponse } from '@/app/(service)/boards/[articleId]/types';
import { IcArrowUpCircle, IcUserXlarge } from '@/assets';

type BoardDetailCommentComposerProps = {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
  userProfile: UserProfileResponse | null;
};

export default function BoardDetailCommentComposer({
  isAuthenticated,
  onRequireAuth,
  userProfile,
}: BoardDetailCommentComposerProps) {
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
      <div className="relative flex-1">
        <input
          type="text"
          readOnly={!isAuthenticated}
          placeholder={
            isAuthenticated
              ? '댓글을 달아주세요'
              : '댓글을 남기려면 로그인해주세요'
          }
          className="w-full border-y border-background-tertiary p-3 text-sm font-normal 
          text-text-primary outline-none placeholder:text-text-default placeholder:text-sm md:text-base"
          onClick={onRequireAuth}
          onFocus={onRequireAuth}
        />
        <button
          type="button"
          aria-label="댓글 등록"
          className="absolute right-3 bottom-3 flex h-6 w-6 items-center justify-center"
          onClick={onRequireAuth}
        >
          <IcArrowUpCircle
            width={24}
            height={24}
            role="img"
            aria-label="댓글 등록"
          />
        </button>
      </div>
    </div>
  );
}
