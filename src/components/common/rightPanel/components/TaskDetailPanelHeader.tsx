'use client';

import { IcMoreVerticalSmall } from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import { TitleInput } from '@/components/common/form';
import type { TaskDetailPanelHeaderProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelHeader({
  draftTitle,
  isEditing,
  onChangeDraftTitle,
  onDelete,
  onStartEdit,
  title,
}: TaskDetailPanelHeaderProps) {
  if (isEditing) {
    return (
      <TitleInput
        value={draftTitle}
        placeholder="제목을 입력해주세요."
        onChange={(event) => {
          onChangeDraftTitle(event.target.value);
        }}
      />
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <h2 className="text-xl font-bold text-text-primary md:text-2xl">
        {title}
      </h2>

      <ListDropdown
        className="shrink-0"
        items={[
          { label: '수정하기', onClick: onStartEdit },
          { label: '삭제하기', onClick: onDelete },
        ]}
        trigger={
          <>
            <span className="sr-only">{`${title} 더보기`}</span>
            <span
              className="flex size-6 items-center justify-center"
              aria-hidden="true"
            >
              <IcMoreVerticalSmall
                width={20}
                height={20}
                className="size-5"
                aria-hidden="true"
              />
            </span>
          </>
        }
      />
    </div>
  );
}
