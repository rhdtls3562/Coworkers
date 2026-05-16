/**
 * 댓글 본문을 3줄로 접어 보여주고, 더보기/접기 토글을 제공하는 컴포넌트입니다.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';

type CommentExpandableTextProps = {
  content: string;
  textClassName?: string;
};

export default function CommentExpandableText({
  content,
  textClassName,
}: CommentExpandableTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) {
      return;
    }

    const measure = () => {
      if (isExpanded) {
        return;
      }
      setHasOverflow(el.scrollHeight > el.clientHeight);
    };

    measure();

    if (isExpanded || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [content, isExpanded]);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const isToggleVisible = isExpanded || hasOverflow;

  return (
    <div className="min-w-0">
      <p
        ref={textRef}
        className={cn(
          'wrap-break-word whitespace-pre-wrap text-sm',
          textClassName ?? 'font-normal text-text-primary',
          !isExpanded && 'line-clamp-3',
        )}
      >
        {content}
      </p>
      {isToggleVisible ? (
        <button
          type="button"
          className="mt-0.5 text-sm font-medium text-brand-primary"
          aria-expanded={isExpanded}
          onClick={handleToggleExpand}
        >
          {isExpanded ? '접기' : '더보기'}
        </button>
      ) : null}
    </div>
  );
}
