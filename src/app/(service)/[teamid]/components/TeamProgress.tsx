import { useParams, usePathname, useRouter } from 'next/navigation';

import MemberChip from '@/app/(service)/[teamid]/components/MemberChip';
import TeamProgressBar from '@/app/(service)/[teamid]/components/TeamProgressBar';
import { TeamProgressModals } from '@/app/(service)/[teamid]/components/TeamProgressModals';
import { TeamProgressStats } from '@/app/(service)/[teamid]/components/TeamProgressState';
import {
  SETTING_BUTTON,
  TEAM_MEMBERS,
} from '@/app/(service)/[teamid]/constants';
import { useModalState } from '@/app/(service)/[teamid]/hooks/useModalState';
import { ListDropdown } from '@/components/common/dropdown';
import useLayoutAuthState from '@/components/layout/hooks/useLayoutAuthState';

export default function TeamProgress() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const layoutAuthState = useLayoutAuthState(pathname);
  const teamName = layoutAuthState.isAuthenticated
    ? layoutAuthState.currentUser.teamName
    : '';

  const { open, close, is, selectedMember, openMemberDetail } = useModalState();

  // 현재 유저 상태가 나뉘어 있지 않아 임시로 구성함
  const masterItems = [
    { label: '수정하기', onClick: () => router.push(`/${params.teamid}/edit`) },
    { label: '삭제하기', onClick: () => open('teamDelete') },
  ];
  const memberItems = [
    { label: '팀 나가기', onClick: () => open('teamLeave') },
  ];
  // TODO: 추후에 유저 상태 나뉘면 유저에 따라 드롭다운 구분할 예정

  return (
    <section className="w-full bg-background-inverse p-6 shadow-[0_4px_10px_rgba(49,84,153,0.06)] md:rounded-[20px] xl:shadow-[0_8px_20px_rgba(49,84,153,0.12)]">
      <div className="flex gap-3 items-center">
        {teamName ? (
          <h2 className="text-text-primary font-bold text-xl md:text-2xl">
            {teamName}
          </h2>
        ) : null}
        <div className="flex justify-between flex-1 items-center xl:hidden">
          <button onClick={() => open('memberList')}>
            <MemberChip members={TEAM_MEMBERS} />
          </button>
          <ListDropdown trigger={SETTING_BUTTON} items={masterItems} />
        </div>
      </div>
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex justify-between xl:pr-10">
          <div>
            <p className="text-sm font-medium text-interaction-inactive md:text-sm">
              오늘의 진행 상황
            </p>
            <p className="text-[32px] font-bold text-brand-primary  md:text-[40px]">
              0%
            </p>
          </div>
          <TeamProgressStats today={0} done={0} />
          {/* Todo: 데이터 가져와 교체 예정 */}
        </div>
        <div className="flex gap-4">
          <div className="w-full h-5 md:h-7">
            <TeamProgressBar />
          </div>
          <div className="hidden xl:block">
            <ListDropdown
              trigger={SETTING_BUTTON}
              items={memberItems}
              className=""
            />
          </div>
        </div>
      </div>
      <TeamProgressModals
        is={is}
        close={close}
        open={open}
        selectedMember={selectedMember}
        openMemberDetail={openMemberDetail}
      />
    </section>
  );
}
