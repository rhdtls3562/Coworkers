'use client';

import type { ReactNode } from 'react';

import Image from 'next/image';

type BoardRemoteImageSlotProps = {
  imageUrl: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  isRemoteFailed: boolean;
  onRemoteError: () => void;
  fallback: ReactNode;
};

export function BoardRemoteImageSlot({
  imageUrl,
  alt,
  width,
  height,
  className,
  isRemoteFailed,
  onRemoteError,
  fallback,
}: BoardRemoteImageSlotProps) {
  if (!imageUrl || isRemoteFailed) {
    return fallback;
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={onRemoteError}
    />
  );
}
