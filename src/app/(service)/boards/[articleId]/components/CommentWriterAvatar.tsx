'use client';

import { CommentWriterAvatarView } from '@/app/(service)/boards/[articleId]/components/CommentWriterAvatarView';
import { useImageLoadFallback } from '@/app/(service)/boards/hooks/useImageLoadFallback';
import { getBoardImageRemountKey } from '@/app/(service)/boards/utils/boardImageKeys';
import { cn } from '@/utils/cn';

type CommentWriterAvatarProps = {
  image: string | null;
  nickname: string;
  width?: number;
  height?: number;
  containerClassName?: string;
  imageClassName?: string;
  iconClassName?: string;
};

type CommentWriterAvatarBodyProps = {
  image: string | null;
  nickname: string;
  width: number;
  height: number;
  imageClassName?: string;
  iconClassName?: string;
};

function CommentWriterAvatarBody({
  image,
  nickname,
  width,
  height,
  imageClassName,
  iconClassName,
}: CommentWriterAvatarBodyProps) {
  const { isRemoteFailed, onRemoteError } = useImageLoadFallback();

  return (
    <CommentWriterAvatarView
      image={image}
      nickname={nickname}
      width={width}
      height={height}
      imageClassName={imageClassName}
      iconClassName={iconClassName}
      isRemoteFailed={isRemoteFailed}
      onRemoteError={onRemoteError}
    />
  );
}

export default function CommentWriterAvatar({
  image,
  nickname,
  width = 28,
  height = 28,
  containerClassName,
  imageClassName,
  iconClassName,
}: CommentWriterAvatarProps) {
  return (
    <div
      className={cn(
        'flex h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-background-tertiary md:h-9 md:w-9',
        containerClassName,
      )}
    >
      <CommentWriterAvatarBody
        key={getBoardImageRemountKey(image)}
        image={image}
        nickname={nickname}
        width={width}
        height={height}
        imageClassName={imageClassName}
        iconClassName={iconClassName}
      />
    </div>
  );
}
