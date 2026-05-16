/**
 * 오른쪽 패널 상세 화면 전용 댓글 입력창입니다.
 */

'use client';

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

import { IcArrowUpCircle, IcArrowUpCircleActive } from '@/assets';
import RightPanelAvatar from '@/components/common/rightPanel/components/RightPanelAvatar';
import { COMMENT_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

type TaskDetailCommentInputProps = {
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<boolean>;
  userImage?: string;
};

export default function TaskDetailCommentInput({
  isSubmitting,
  onSubmit,
  userImage,
}: TaskDetailCommentInputProps) {
  const [value, setValue] = useState('');
  const [isSubmittingLocally, setIsSubmittingLocally] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCommentAtLimit = value.length >= COMMENT_TEXT_LIMIT;

  const isActive =
    value.trim().length > 0 && !isSubmitting && !isSubmittingLocally;

  const resizeTextarea = () => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    resizeTextarea();
  };

  const resetTextarea = () => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
  };

  const handleSubmit = async () => {
    if (!isActive || isSubmitting || isSubmittingLocally) {
      return;
    }

    setIsSubmittingLocally(true);
    const isSubmitted = await onSubmit(value.trim());
    setIsSubmittingLocally(false);

    if (!isSubmitted) {
      return;
    }

    setValue('');
    resetTextarea();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || event.repeat) {
      return;
    }

    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    await handleSubmit();
  };

  return (
    <>
      <div className="flex flex-row items-center gap-3 border-y border-background-tertiary py-3">
        <RightPanelAvatar alt="" image={userImage} />
        <textarea
          ref={textareaRef}
          value={value}
          disabled={isSubmitting}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={COMMENT_TEXT_LIMIT}
          rows={1}
          placeholder="댓글을 달아주세요"
          className="min-h-6 flex-1 resize-none overflow-hidden bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-default md:text-base"
        />
        <button
          type="button"
          aria-label="댓글 등록"
          onClick={handleSubmit}
          disabled={!isActive}
          className="flex size-6 shrink-0 items-center justify-center"
        >
          {isActive ? (
            <IcArrowUpCircleActive
              width={24}
              height={24}
              className="size-6"
              aria-hidden="true"
            />
          ) : (
            <IcArrowUpCircle
              width={24}
              height={24}
              className="size-6"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between mt-1 w-full">
        {isCommentAtLimit ? (
          <p className="text-left text-sm font-medium text-status-danger">
            {COMMENT_TEXT_LIMIT}자 이내로 작성해주세요.
          </p>
        ) : (
          <span />
        )}
        <p className="text-right text-sm text-text-default">
          {value.length}/{COMMENT_TEXT_LIMIT}
        </p>
      </div>
    </>
  );
}
