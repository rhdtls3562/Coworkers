'use client';

import { useState } from 'react';

import Image from 'next/image';

import { IcUserXlarge } from '@/assets/index';

interface UserAvatarProps {
  userImage?: string | null;
  userName: string;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  userImage,
  userName,
  size = 24,
  className = '',
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (userImage && !imgError) {
    return (
      <Image
        src={userImage}
        alt={`${userName} 프로필 이미지`}
        width={size}
        height={size}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <IcUserXlarge
      width={size}
      height={size}
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={`${userName} 프로필 이미지`}
    />
  );
}
