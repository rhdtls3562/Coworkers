'use client';

import { IcMoreVerticalSmall } from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import { TitleInput } from '@/components/common/form';
import type { TaskDetailPanelHeaderProps } from '@/components/common/rightPanel/types';
import { TITLE_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

export default function TaskDetailPanelHeader({
  draftTitle,
  isEditing,
  onChangeDraftTitle,
  onDelete,
  onStartEdit,
  title,
}: TaskDetailPanelHeaderProps) {
  if (isEditing) {
    const isAtLimit = draftTitle.length >= TITLE_TEXT_LIMIT;
    return (
      <>
        <TitleInput
          value={draftTitle}
          placeholder="제목을 입력해주세요."
          maxLength={TITLE_TEXT_LIMIT}
          onChange={(event) => {
            onChangeDraftTitle(event.target.value);
          }}
        />
        <div className="flex items-center justify-between mt-1">
          {isAtLimit ? (
            <p className="text-sm font-medium text-status-danger">
              {TITLE_TEXT_LIMIT}자 이내로 작성해주세요.
            </p>
          ) : (
            <span />
          )}
          <p className="text-right text-sm text-text-default">
            {draftTitle.length}/{TITLE_TEXT_LIMIT}
          </p>
        </div>
      </>
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
