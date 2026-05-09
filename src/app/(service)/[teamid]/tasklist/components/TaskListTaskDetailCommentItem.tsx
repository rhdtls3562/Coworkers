'use client';

import Image from 'next/image';

import TaskListTaskDetailCommentActions from '@/app/(service)/[teamid]/tasklist/components/TaskListTaskDetailCommentActions';
import {
  COMMENT_ACTIONS_SLOT_CLASS_NAME,
  COMMENT_BODY_ACTIONS_ROW_CLASS_NAME,
  COMMENT_BODY_LEFT_SLOT_CLASS_NAME,
  COMMENT_FORM_TEXTAREA_CLASS_NAME,
  COMMENT_ROW_BLEED_X,
  commentItemRootClassName,
} from '@/app/(service)/[teamid]/tasklist/taskListTaskDetailCommentClassNames';
import type { TaskListTaskDetailCommentItemProps } from '@/app/(service)/[teamid]/tasklist/types';
import { IcMoreVerticalSmall, IcUserLarge } from '@/assets';
import { ListDropdown } from '@/components/common/dropdown';
import { cn } from '@/utils/cn';

function CommentAvatar({
  author,
  authorImage,
}: {
  author: string;
  authorImage: string | null;
}) {
  if (authorImage) {
    return (
      <Image
        src={authorImage}
        alt={`${author} 프로필`}
        width={36}
        height={36}
        className="mt-0.5 size-8 shrink-0 rounded-lg object-cover md:size-9"
      />
    );
  }

  return (
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary md:size-9">
      <IcUserLarge width={20} height={20} aria-hidden="true" />
    </span>
  );
}

export default function TaskListTaskDetailCommentItem({
  comment,
  currentUserName,
  draftContent,
  isEditing,
  onCancelEdit,
  onChangeDraftContent,
  onDelete,
  onStartEdit,
  onSubmitEdit,
}: TaskListTaskDetailCommentItemProps) {
  const isOwnComment = comment.author === currentUserName;

  if (isEditing) {
    return (
      <li className={cn('bg-icon-inverse py-4', COMMENT_ROW_BLEED_X)}>
        <div className="flex gap-3">
          <CommentAvatar
            author={comment.author}
            authorImage={comment.authorImage}
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-primary md:text-base">
              {comment.author}
            </p>

            <div className={cn('mt-3', COMMENT_BODY_ACTIONS_ROW_CLASS_NAME)}>
              <div className={COMMENT_BODY_LEFT_SLOT_CLASS_NAME}>
                <textarea
                  value={draftContent}
                  placeholder="내용을 입력하세요."
                  className={cn(
                    COMMENT_FORM_TEXTAREA_CLASS_NAME,
                    'w-full min-w-0',
                  )}
                  onChange={(event) => {
                    onChangeDraftContent(event.target.value);
                  }}
                />
              </div>

              <div className={COMMENT_ACTIONS_SLOT_CLASS_NAME}>
                <TaskListTaskDetailCommentActions
                  primaryLabel="등록하기"
                  onCancel={onCancelEdit}
                  onPrimaryAction={onSubmitEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={commentItemRootClassName(isOwnComment)}>
      <div className="flex gap-3">
        <CommentAvatar
          author={comment.author}
          authorImage={comment.authorImage}
        />

        <div className="min-w-0 flex-1">
          {isOwnComment ? (
            <>
              <p className="text-sm font-bold text-text-primary md:text-base">
                {comment.author}
              </p>
              <div className={cn('mt-3', COMMENT_BODY_ACTIONS_ROW_CLASS_NAME)}>
                <div className={COMMENT_BODY_LEFT_SLOT_CLASS_NAME}>
                  <p className="whitespace-pre-line text-sm font-medium leading-5 text-text-secondary md:text-base">
                    {comment.content}
                  </p>
                  <div className="text-sm font-medium text-interaction-inactive">
                    {comment.meta}
                  </div>
                  <button
                    data-allow-unsaved="true"
                    type="button"
                    className="self-start text-sm font-medium text-text-default hover:text-text-primary"
                    onClick={onDelete}
                  >
                    삭제하기
                  </button>
                </div>

                <div className={COMMENT_ACTIONS_SLOT_CLASS_NAME}>
                  <TaskListTaskDetailCommentActions
                    primaryLabel="수정하기"
                    onCancel={() => {}}
                    onPrimaryAction={onStartEdit}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary md:text-base">
                    {comment.author}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm font-medium leading-5 text-text-secondary md:text-base">
                    {comment.content}
                  </p>
                </div>

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
              </div>

              <div className="mt-2 text-sm font-medium text-interaction-inactive">
                {comment.meta}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
