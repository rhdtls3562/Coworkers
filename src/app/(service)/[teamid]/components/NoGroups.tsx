/** 소속 팀이 없을 때 표시하는 빈 상태 컴포넌트입니다. */

import Image from 'next/image';
import Link from 'next/link';

import { imgNoTeam } from '@/assets/index';

export default function NoGroup() {
  return (
    <div className="flex flex-col gap-12 justify-center items-center h-full md:gap-20 ">
      <div className="flex flex-col gap-6 justify-center md:gap-8">
        <h2 className="sr-only">소속된 팀이 없습니다</h2>
        <h3 className="sr-only">팀 생성 또는 팀 참여 안내</h3>
        {imgNoTeam && (
          <Image
            src={imgNoTeam}
            width={404}
            height={264}
            alt=""
            loading="eager"
            className="w-46 md:w-80 xl:w-101"
          />
        )}
        <p className="text-center font-medium text-sm text-text-default">
          아직 소속된 팀이 없습니다.
          <br />
          팀을 생성하거나 팀에 참여해보세요.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-46 md:gap-4">
        <Link
          href="/addteam"
          className="rounded-xl text-text-inverse text-base font-semibold bg-brand-primary w-full flex justify-center items-center h-12 hover:bg-brand-tertiary transition-all duration-200"
        >
          팀 생성하기
        </Link>
        <Link
          href="/jointeam"
          className="rounded-xl text-brand-primary text-base font-semibold border border-brand-primary w-full flex justify-center items-center h-12 hover:bg-background-tertiary transition-all duration-200"
        >
          팀 참여하기
        </Link>
      </div>
    </div>
  );
}
