/**
 * 오른쪽 패널 상세 화면 전용 댓글 입력창입니다.
 */

'use client';

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

import { IcArrowUpCircle, IcArrowUpCircleActive, IcUserLarge } from '@/assets';

type TaskDetailCommentInputProps = {
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<boolean>;
};

export default function TaskDetailCommentInput({
  isSubmitting,
  onSubmit,
}: TaskDetailCommentInputProps) {
  const [value, setValue] = useState('');
  const [isSubmittingLocally, setIsSubmittingLocally] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex items-center gap-3 border-y border-background-tertiary py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary md:size-9">
        <IcUserLarge width={20} height={20} aria-hidden="true" />
      </span>

      <textarea
        ref={textareaRef}
        value={value}
        disabled={isSubmitting}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
  );
}
