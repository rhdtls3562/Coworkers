'use client';

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

import { IcArrowUpCircle, IcArrowUpCircleActive, IcUserLarge } from '@/assets';

export default function TaskListTaskDetailCommentInput() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isActive = value.trim().length > 0;

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

  const handleSubmit = () => {
    if (!isActive) {
      return;
    }

    setValue('');

    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleSubmit();
  };

  return (
    <div className="flex items-center gap-3 border-y border-background-tertiary py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary md:size-9">
        <IcUserLarge width={20} height={20} aria-hidden="true" />
      </span>

      <textarea
        ref={textareaRef}
        value={value}
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
