/**
 * 할 일 리스트 메인 영역 상단 팀 헤더입니다.
 */

'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import TaskListTaskRowOptionsMenu from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskRowOptionsMenu';
import TaskListTeamPageDeleteModal from '@/app/(service)/[teamid]/tasklist/components/TaskListTeamPageDeleteModal';
import { IcSettingsLarge, IcSettingsSmall } from '@/assets';
import { cn } from '@/utils/cn';

type TaskListPageHeaderProps = {
  teamId: string;
  teamName: string;
  className?: string;
  onConfirmTeamPageDelete?: () => void | Promise<void>;
};

export default function TaskListPageHeader({
  teamId,
  teamName,
  className,
  onConfirmTeamPageDelete,
}: TaskListPageHeaderProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    await onConfirmTeamPageDelete?.();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'flex min-w-0 items-center bg-transparent p-0',
          'h-5 w-full gap-1',
          'md:h-7 md:shrink-0',
          'lg:h-16 lg:w-full lg:max-w-none lg:gap-0 lg:overflow-hidden lg:rounded-xl lg:bg-background-inverse lg:shadow-[0_8px_20px_rgba(49,84,153,0.12)]',
          className,
        )}
        aria-label="팀"
      >
        <h2
          className={cn(
            'min-w-0 flex-1 truncate font-bold text-text-primary',
            'text-[20px] leading-5',
            'md:text-2xl md:leading-7',
            'lg:flex-1 lg:pl-6',
          )}
        >
          {teamName}
        </h2>

        <TaskListTaskRowOptionsMenu
          className={cn(
            'inline-flex shrink-0 items-center justify-center',
            'lg:mr-6',
          )}
          items={[
            {
              label: '수정하기',
              onClick: () => {
                router.push(`/${teamId}/edit`);
              },
            },
            {
              label: '삭제하기',
              onClick: () => {
                setIsDeleteModalOpen(true);
              },
            },
          ]}
          trigger={
            <>
              <span className="sr-only">{`${teamName} 팀 메뉴 열기`}</span>
              <span className="inline-flex size-5 items-center justify-center md:size-6">
                <IcSettingsSmall
                  width={24}
                  height={24}
                  className="size-5 md:size-6 lg:hidden"
                  aria-hidden="true"
                />
                <IcSettingsLarge
                  width={24}
                  height={24}
                  className="hidden lg:block"
                  aria-hidden="true"
                />
              </span>
            </>
          }
        />
      </header>

      {isDeleteModalOpen ? (
        <TaskListTeamPageDeleteModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          pageTitle={teamName}
        />
      ) : null}
    </>
  );
}
