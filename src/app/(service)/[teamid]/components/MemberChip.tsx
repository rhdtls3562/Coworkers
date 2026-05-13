import { MemberChipsProps } from '@/app/(service)/[teamid]/types';

import UserAvatar from './UserImage';

export default function MemberChip({
  members,
}: {
  members: MemberChipsProps[];
}) {
  return (
    <div className="border-background-tertiary border rounded-lg flex gap-2 h-8 pr-2 pl-3 justify-center items-center  ">
      <div className="flex flex-row">
        {members.map((member) => (
          <UserAvatar
            key={member.userId}
            userImage={member.userImage}
            userName={member.userName}
            size={24}
          />
        ))}
      </div>
      <p className="text-text-default text-sm font-medium">{members.length}</p>
    </div>
  );
}
