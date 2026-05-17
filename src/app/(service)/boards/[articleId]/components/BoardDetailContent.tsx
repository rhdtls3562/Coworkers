/** 게시글 상세 본문 컴포넌트입니다. */

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import type { BoardDetailProps } from '@/app/(service)/boards/[articleId]/types';
import BoardPostImageWithFallback from '@/app/(service)/boards/components/BoardPostImageWithFallback';

export default function BoardDetailContent({ boardDetail }: BoardDetailProps) {
  return (
    <div className="min-h-50 min-w-0 py-4 md:py-7 lg:pb-10">
      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {boardDetail.content}
        </ReactMarkdown>
      </div>
      {boardDetail.image && (
        <div className="w-35 h-35 mt-5 md:mt-6 md:w-50 md:h-50 rounded-xl overflow-hidden">
          <BoardPostImageWithFallback
            src={boardDetail.image}
            alt={`${boardDetail.title} 게시글 이미지`}
            width={140}
            height={140}
            className="object-cover object-center h-full w-full"
          />
        </div>
      )}
    </div>
  );
}
