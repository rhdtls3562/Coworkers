/**
 * 오른쪽 패널 상세 화면 댓글 아이템 한 개를 렌더링하는 컴포넌트입니다.
 */

'use client';

import { IcMoreVerticalSmall } from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import RightPanelAvatar from '@/components/common/rightPanel/components/RightPanelAvatar';
import TaskDetailCommentActions from '@/components/common/rightPanel/components/TaskDetailCommentActions';
import type { TaskDetailCommentItemProps } from '@/components/common/rightPanel/types';
import { formatCommentTime } from '@/components/common/rightPanel/utils/rightPanelCommentParsers';

export default function TaskDetailCommentItem({
  comment,
  draftContent,
  isEditing,
  isSubmitting,
  onCancelEdit,
  onChangeDraftContent,
  onDelete,
  onStartEdit,
  onSubmitEdit,
}: TaskDetailCommentItemProps) {
  console.log('comment', comment);
  if (isEditing) {
    return (
      <li className="bg-background-secondary py-4 first:pt-4 last:pb-4">
        <div className="flex gap-3 px-4 md:px-5">
          <RightPanelAvatar
            alt=""
            className="mt-0.5"
            image={comment.authorImage}
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-primary md:text-base">
              {comment.author}
            </p>

            <div className="mt-3 flex flex-col gap-3">
              <textarea
                value={draftContent}
                placeholder="내용을 입력하세요."
                className="min-h-18 w-full resize-none rounded-xl border border-background-tertiary bg-background-primary px-4 py-3 text-sm font-medium text-text-primary outline-none placeholder:text-text-default focus:border-brand-primary md:text-base"
                onChange={(event) => {
                  onChangeDraftContent(event.target.value);
                }}
              />

              <TaskDetailCommentActions
                isPrimaryDisabled={
                  isSubmitting || draftContent.trim() === comment.content.trim()
                }
                primaryLabel="수정하기"
                onCancel={onCancelEdit}
                onPrimaryAction={onSubmitEdit}
              />
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex gap-3">
        <RightPanelAvatar
          alt=""
          className="mt-0.5"
          image={comment.authorImage}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-bold text-text-primary md:text-base">
                {comment.author}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm font-medium leading-5 text-text-secondary md:text-base">
                {comment.content}
              </p>
            </div>

            {comment.isMine && (
              <ListDropdown
                className="shrink-0"
                items={[
                  { label: '수정하기', onClick: onStartEdit },
                  { label: '삭제하기', onClick: onDelete },
                ]}
                trigger={
                  <>
                    <span className="sr-only">{`${comment.author} 댓글 더보기`}</span>
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
            )}
          </div>

          <div className="mt-2 text-sm font-medium text-interaction-inactive mb-5">
            {formatCommentTime(comment.createdAt)}
          </div>
        </div>
      </div>
    </li>
  );
}
