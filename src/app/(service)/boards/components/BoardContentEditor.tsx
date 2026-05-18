'use client';

/** 게시글 내용 입력 영역 컴포넌트입니다. 작성 탭과 마크다운 미리보기 탭을 제공합니다. */

import { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { ContentTextarea } from '@/components/common/form';
import { ARTICLE_CONTENT_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';
import { cn } from '@/utils/cn';

type BoardContentEditorProps = {
  id: string;
  value: string;
  errorMessage?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur: () => void;
};

export default function BoardContentEditor({
  id,
  value,
  errorMessage,
  onChange,
  onBlur,
}: BoardContentEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const isAtLimit = value.length >= ARTICLE_CONTENT_TEXT_LIMIT;

  return (
    <div>
      <div className="flex gap-1 mb-2 md:mb-3">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={cn(
            'px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors',
            !isPreview
              ? 'bg-brand-primary text-text-inverse'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          작성
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={cn(
            'px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors',
            isPreview
              ? 'bg-brand-primary text-text-inverse'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          미리보기
        </button>
      </div>

      {isPreview ? (
        <div className="markdown-body min-h-50 md:min-h-60 w-full rounded-xl border border-border-primary bg-background-secondary px-4 py-3">
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="m-0 text-text-disabled">미리볼 내용이 없습니다.</p>
          )}
        </div>
      ) : (
        <ContentTextarea
          id={id}
          name="content"
          placeholder="내용을 입력하세요"
          className="h-50 md:h-60"
          value={value}
          errorMessage={errorMessage}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={ARTICLE_CONTENT_TEXT_LIMIT}
        />
      )}

      <div className="flex items-center justify-between mt-1">
        {isAtLimit ? (
          <p className="text-left text-sm font-medium text-status-danger">
            {ARTICLE_CONTENT_TEXT_LIMIT}자 이내로 작성해주세요.
          </p>
        ) : (
          <span />
        )}
        <p className="text-right text-sm text-text-default">
          {value.length}/{ARTICLE_CONTENT_TEXT_LIMIT}
        </p>
      </div>
    </div>
  );
}
