import UserAvatar from '@/app/(service)/[teamid]/components/UserImage';
import { MemberCardProps } from '@/app/(service)/[teamid]/types';
import { IcMoreVerticalLarge } from '@/assets/index';

export default function MemberCard({
  name,
  email,
  userImage,
  onClick,
}: MemberCardProps) {
  return (
    <div className="flex gap-3 items-center cursor-default w-full">
      <div className="overflow-hidden w-9 h-9 rounded-xl bg-background-tertiary flex items-center justify-center shrink-0 border border-border-secondary">
        <UserAvatar userImage={userImage} userName={name} size={36} />
      </div>
      <div className="flex-1 w-[calc(100%-76px)]">
        <p className="font-semibold text-text-primary text-base text-left">
          {name}
        </p>
        <p className="truncate font-normal text-text-secondary text-sm text-left no-underline">
          {email}
        </p>
      </div>
      <button onClick={onClick}>
        <IcMoreVerticalLarge width="16" height="16" aria-hidden="true" />
      </button>
    </div>
  );
}
