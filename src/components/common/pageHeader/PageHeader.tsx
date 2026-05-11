/**
 * 페이지 상단 제목 영역을 렌더링하는 공용 컴포넌트입니다.
 */

'use client';

import { IcSettingsLarge } from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import type { PageHeaderProps } from '@/components/common/pageHeader/types';
import { cn } from '@/utils/cn';

export default function PageHeader({
  className,
  hasSettingsButton = false,
  settingsItems,
  title,
}: PageHeaderProps) {
  const hasSettingsMenu = hasSettingsButton && (settingsItems?.length ?? 0) > 0;

  return (
    <div
      className={cn(
        'flex items-center 2xl:h-16 2xl:rounded-xl 2xl:bg-background-inverse 2xl:px-6 2xl:shadow-[0_8px_20px_rgba(49,84,153,0.12)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 md:gap-2.5 2xl:w-full 2xl:justify-between 2xl:gap-0">
        <h2 className="text-xl font-bold text-text-primary md:text-2xl">
          {title}
        </h2>

        {hasSettingsMenu && settingsItems ? (
          <ListDropdown
            className="relative"
            items={settingsItems}
            trigger={
              <>
                <span className="sr-only">{`${title} 설정 메뉴 열기`}</span>
                <IcSettingsLarge
                  width={24}
                  height={24}
                  className="size-5 text-interaction-inactive md:size-6"
                  aria-hidden="true"
                />
              </>
            }
          />
        ) : null}
      </div>
    </div>
  );
}
