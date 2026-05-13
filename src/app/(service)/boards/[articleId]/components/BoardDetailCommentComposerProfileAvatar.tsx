'use client';

import { getBoardCommentComposerProfileAvatarAccessibleLabel } from '@/app/(service)/boards/[articleId]/utils/getBoardCommentComposerProfileAvatarAccessibleLabel';
import { BoardRemoteImageSlot } from '@/app/(service)/boards/components/BoardRemoteImageSlot';
import { useImageLoadFallback } from '@/app/(service)/boards/hooks/useImageLoadFallback';
import { IcUserXlarge } from '@/assets';

type BoardDetailCommentComposerProfileAvatarViewProps = {
  image: string | null;
  accessibleLabel: string;
  isRemoteFailed: boolean;
  onRemoteError: () => void;
};

function BoardDetailCommentComposerProfileAvatarView({
  image,
  accessibleLabel,
  isRemoteFailed,
  onRemoteError,
}: BoardDetailCommentComposerProfileAvatarViewProps) {
  return (
    <BoardRemoteImageSlot
      imageUrl={image}
      alt={accessibleLabel}
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
          aria-label={accessibleLabel}
        />
      }
    />
  );
}

type BoardDetailCommentComposerProfileAvatarProps = {
  image: string | null;
  nickname: string;
  isGuest: boolean;
};

export default function BoardDetailCommentComposerProfileAvatar({
  image,
  nickname,
  isGuest,
}: BoardDetailCommentComposerProfileAvatarProps) {
  const { isRemoteFailed, onRemoteError } = useImageLoadFallback();
  const accessibleLabel = getBoardCommentComposerProfileAvatarAccessibleLabel(
    isGuest,
    nickname,
  );

  return (
    <BoardDetailCommentComposerProfileAvatarView
      image={image}
      accessibleLabel={accessibleLabel}
      isRemoteFailed={isRemoteFailed}
      onRemoteError={onRemoteError}
    />
  );
}
