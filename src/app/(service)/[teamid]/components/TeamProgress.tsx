/**
 * 팀 페이지 상단 진행 상황 카드와 관련 모달을 렌더링합니다.
 */

import { useParams, useRouter } from 'next/navigation';

import MemberChip from '@/app/(service)/[teamid]/components/MemberChip';
import TeamProgressBar from '@/app/(service)/[teamid]/components/TeamProgressBar';
import { TeamProgressModals } from '@/app/(service)/[teamid]/components/TeamProgressModals';
import { TeamProgressStats } from '@/app/(service)/[teamid]/components/TeamProgressState';
import {
  CREATE_MASTER_ITEMS,
  CREATE_MEMBER_ITEMS,
  SETTING_BUTTON,
} from '@/app/(service)/[teamid]/constants';
import { useModalState } from '@/app/(service)/[teamid]/hooks/useModalState';
import { TeamProgressProps } from '@/app/(service)/[teamid]/types';
import {
  donePercent,
  doneTasks,
  totalTasks,
} from '@/app/(service)/[teamid]/utils/task';
import { ListDropdown } from '@/components/common/dropdown';

export default function TeamProgress({ role, teamData }: TeamProgressProps) {
  const router = useRouter();
  const params = useParams();
  const { open, close, reset, is, selectedMember, openMemberDetail } =
    useModalState();

  if (!teamData) return null;

  const masterItems = CREATE_MASTER_ITEMS(
    params.teamid as string,
    router.push,
    open,
  );
  const memberItems = CREATE_MEMBER_ITEMS(open);

  return (
    <section className="w-full bg-background-inverse p-6 shadow-[0_4px_10px_rgba(49,84,153,0.06)] md:rounded-[20px] xl:shadow-[0_8px_20px_rgba(49,84,153,0.12)]">
      <div className="flex gap-3 items-center mb-8">
        {teamData ? (
          <h2 className="text-text-primary font-bold text-xl md:text-2xl">
            {teamData.name}
          </h2>
        ) : null}
        <div className="flex justify-between flex-1 items-center xl:hidden">
          <button onClick={() => open('memberList')}>
            <MemberChip members={teamData.members} />
          </button>
          <ListDropdown
            trigger={SETTING_BUTTON}
            items={role === 'ADMIN' ? masterItems : memberItems}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex justify-between xl:pr-10">
          <div>
            <p className="text-sm font-medium text-interaction-inactive md:text-sm">
              오늘의 진행 상황
            </p>
            <p className="text-[32px] font-bold text-brand-primary md:text-[40px]">
              {donePercent(teamData)}%
            </p>
          </div>
          <TeamProgressStats
            today={totalTasks(teamData)}
            done={doneTasks(teamData)}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-full h-5 md:h-7">
            <TeamProgressBar completed={donePercent(teamData)} />
          </div>
          <div className="hidden xl:block">
            <ListDropdown
              trigger={SETTING_BUTTON}
              items={role === 'ADMIN' ? masterItems : memberItems}
            />
          </div>
        </div>
      </div>

      <TeamProgressModals
        is={is}
        close={close}
        reset={reset}
        open={open}
        selectedMember={selectedMember}
        openMemberDetail={openMemberDetail}
        members={teamData.members}
        teamName={teamData.name}
        role={role}
      />
    </section>
  );
}
