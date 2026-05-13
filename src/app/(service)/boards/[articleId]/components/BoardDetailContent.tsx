import type { BoardDetailProps } from '@/app/(service)/boards/[articleId]/types';
import BoardPostImageWithFallback from '@/app/(service)/boards/components/BoardPostImageWithFallback';

export default function BoardDetailContent({ boardDetail }: BoardDetailProps) {
  return (
    <div className="min-h-50 py-4 md:py-7 lg:pb-10">
      <p className="text-sm font-regular leading-5.5 text-text-primary md:text-base md:leading-6">
        {boardDetail.content}
      </p>
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
