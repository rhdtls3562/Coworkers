import Image from 'next/image';

import { MemberCardProps } from '@/app/(service)/[teamid]/types';
import { IcMoreVerticalLarge, IcUserXlarge } from '@/assets/index';

export default function MemberCard({
  name,
  email,
  userImage,
  onClick,
}: MemberCardProps) {
  return (
    <div className="flex gap-3 items-center cursor-default w-full">
      <div className="overflow-hidden w-9 h-9 rounded-xl bg-background-tertiary flex items-center justify-center shrink-0">
        {userImage ? (
          <Image
            src={userImage}
            width={36}
            height={36}
            alt={`${name}'s profile photo`}
            className="w-full h-full object-cover "
          />
        ) : (
          <IcUserXlarge
            width={36}
            height={36}
            className="w-6 h-6"
            role="img"
            aria-label={`${name}'s profile photo`}
          />
        )}
      </div>
      <div className="flex-1 w-[calc(100%-76px)]">
        <p className="font-semibold text-text-primary text-base text-left">
          {name}
        </p>
        <p className="truncate font-normal text-text-secondary text-sm text-left">
          {email}
        </p>
      </div>
      <button onClick={onClick}>
        <IcMoreVerticalLarge width="16" height="16" aria-hidden="true" />
      </button>
    </div>
  );
}
