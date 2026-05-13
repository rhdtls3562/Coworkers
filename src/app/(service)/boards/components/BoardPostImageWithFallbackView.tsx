'use client';

import Image from 'next/image';

import { ImgLogoSymbolLarge } from '@/assets';
import { cn } from '@/utils/cn';

type BoardPostImageWithFallbackViewProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  isLogoFallback: boolean;
  onRemoteImageError: () => void;
};

export function BoardPostImageWithFallbackView({
  src,
  alt,
  width,
  height,
  className,
  isLogoFallback,
  onRemoteImageError,
}: BoardPostImageWithFallbackViewProps) {
  if (isLogoFallback) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-background-tertiary p-2',
          className,
        )}
      >
        <ImgLogoSymbolLarge
          width={width}
          height={height}
          className="max-h-full max-w-full object-contain"
          role="img"
          aria-label={alt}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={onRemoteImageError}
    />
  );
}
