'use client';

import { BoardRemoteImageSlot } from '@/app/(service)/boards/components/BoardRemoteImageSlot';
import { useImageLoadFallback } from '@/app/(service)/boards/hooks/useImageLoadFallback';
import { IcUserXlarge } from '@/assets';

type BoardDetailCommentComposerProfileAvatarViewProps = {
  image: string | null;
  nickname: string;
  guestAriaLabel: string;
  isRemoteFailed: boolean;
  onRemoteError: () => void;
};

function BoardDetailCommentComposerProfileAvatarView({
  image,
  nickname,
  guestAriaLabel,
  isRemoteFailed,
  onRemoteError,
}: BoardDetailCommentComposerProfileAvatarViewProps) {
  return (
    <BoardRemoteImageSlot
      imageUrl={image}
      alt={`${nickname}의 프로필 이미지`}
      width={28}
      height={28}
      className="size-7 object-cover md:size-8"
      isRemoteFailed={isRemoteFailed}
      onRemoteError={onRemoteError}
      fallback={
        <IcUserXlarge
          width={28}
          height={28}
          className="size-7 md:size-8"
          role="img"
          aria-label={guestAriaLabel}
        />
      }
    />
  );
}

type BoardDetailCommentComposerProfileAvatarProps = {
  image: string | null;
  nickname: string;
  guestAriaLabel: string;
};

export default function BoardDetailCommentComposerProfileAvatar({
  image,
  nickname,
  guestAriaLabel,
}: BoardDetailCommentComposerProfileAvatarProps) {
  const { isRemoteFailed, onRemoteError } = useImageLoadFallback();

  return (
    <BoardDetailCommentComposerProfileAvatarView
      image={image}
      nickname={nickname}
      guestAriaLabel={guestAriaLabel}
      isRemoteFailed={isRemoteFailed}
      onRemoteError={onRemoteError}
    />
  );
}
