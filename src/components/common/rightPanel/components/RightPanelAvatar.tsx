'use client';

import Image from 'next/image';

import { IcUserLarge } from '@/assets';
import { cn } from '@/utils/cn';

type RightPanelAvatarProps = {
  alt: string;
  image?: string | null;
  className?: string;
  iconClassName?: string;
};

export default function RightPanelAvatar({
  alt,
  className,
  iconClassName,
  image,
}: RightPanelAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={alt}
        width={36}
        height={36}
        className={cn('size-8 rounded-lg object-cover md:size-9', className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary md:size-9',
        className,
      )}
    >
      <IcUserLarge
        width={20}
        height={20}
        className={cn('size-5', iconClassName)}
        aria-hidden="true"
      />
    </span>
  );
}
