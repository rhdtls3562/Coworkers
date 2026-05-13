'use client';

import { BoardPostImageWithFallbackView } from '@/app/(service)/boards/components/BoardPostImageWithFallbackView';
import { useImageLoadFallback } from '@/app/(service)/boards/hooks/useImageLoadFallback';
import { getBoardImageRemountKey } from '@/app/(service)/boards/utils/boardImageKeys';

type BoardPostImageWithFallbackProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

function BoardPostImageWithFallbackBody(
  props: BoardPostImageWithFallbackProps,
) {
  const { isRemoteFailed, onRemoteError } = useImageLoadFallback();

  return (
    <BoardPostImageWithFallbackView
      {...props}
      isLogoFallback={isRemoteFailed}
      onRemoteImageError={onRemoteError}
    />
  );
}

export default function BoardPostImageWithFallback(
  props: BoardPostImageWithFallbackProps,
) {
  return (
    <BoardPostImageWithFallbackBody
      key={getBoardImageRemountKey(props.src)}
      {...props}
    />
  );
}
