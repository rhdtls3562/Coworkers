import UserAvatar from '@/app/(service)/[teamid]/components/UserImage';
import { MemberChipsProps } from '@/app/(service)/[teamid]/types';

export default function MemberChip({
  members,
}: {
  members: MemberChipsProps[];
}) {
  return (
    <div className="border-background-tertiary border rounded-lg flex gap-2 h-8 pr-2 pl-3 justify-center items-center  ">
      <div className="flex flex-row">
        {members.slice(0, 3).map((member) => (
          <div
            key={member.userId}
            className="border-background-tertiary bg-background-tertiary border rounded-lg flex h-6 w-6 overflow-hidden justify-center items-center -ml-2 "
          >
            <UserAvatar
              userImage={member.userImage}
              userName={member.userName}
              size={24}
            />
          </div>
        ))}
      </div>
      <p className="text-text-default text-sm font-medium">{members.length}</p>
    </div>
  );
}
