'use client';

import { BoardRemoteImageSlot } from '@/app/(service)/boards/components/BoardRemoteImageSlot';
import { IcUserXlarge } from '@/assets';
import { cn } from '@/utils/cn';

type CommentWriterAvatarViewProps = {
  image: string | null;
  nickname: string;
  width: number;
  height: number;
  imageClassName?: string;
  iconClassName?: string;
  isRemoteFailed: boolean;
  onRemoteError: () => void;
};

export function CommentWriterAvatarView({
  image,
  nickname,
  width,
  height,
  imageClassName,
  iconClassName,
  isRemoteFailed,
  onRemoteError,
}: CommentWriterAvatarViewProps) {
  const alt = `${nickname}의 프로필 이미지`;

  return (
    <BoardRemoteImageSlot
      imageUrl={image}
      alt={alt}
      width={width}
      height={height}
      className={cn('size-7 object-cover md:size-9', imageClassName)}
      isRemoteFailed={isRemoteFailed}
      onRemoteError={onRemoteError}
      fallback={
        <IcUserXlarge
          width={width}
          height={height}
          className={cn('size-7 object-cover md:size-9', iconClassName)}
          role="img"
          aria-label={alt}
        />
      }
    />
  );
}
