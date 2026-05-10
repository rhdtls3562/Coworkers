import Image from 'next/image';

import { MemberChipsProps } from '@/app/(service)/[teamid]/types';
import { IcUserXlarge } from '@/assets/index';

export default function MemberChip({
  members,
}: {
  members: MemberChipsProps[];
}) {
  return (
    <div className="border-background-tertiary border rounded-lg flex gap-2 h-8 pr-2 pl-3 justify-center items-center  ">
      <div className="flex flex-row">
        {members.map((member) =>
          member.userImage ? (
            <div
              key={member.userId}
              className="w-6 h-6 rounded-lg -ml-2 border border-background-inverse bg-background-tertiary shrink-0 block overflow-hidden"
            >
              <Image
                src={member.userImage}
                alt={member.userName}
                className="w-full h-full object-cover "
                width={24}
                height={24}
              />
            </div>
          ) : (
            <IcUserXlarge
              key={member.userId}
              width={24}
              height={24}
              className="w-6 h-6 rounded-lg -ml-2 border border-background-inverse bg-background-tertiary"
              role="img"
              aria-label={member.userName}
            />
          ),
        )}
      </div>
      <p className="text-text-default text-sm font-medium">{members.length}</p>
    </div>
  );
}
