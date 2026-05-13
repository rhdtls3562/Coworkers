import Link from 'next/link';

import BoardPostImageWithFallback from '@/app/(service)/boards/components/BoardPostImageWithFallback';
import type { Post } from '@/app/(service)/boards/types';
import {
  formatDateToYmd,
  getLikeCount,
} from '@/app/(service)/boards/utils/boardDisplayUtils';
import { IcHeartSmall } from '@/assets';
import { ROUTES } from '@/constants/ROUTES';

export default function BoardListCard({ post }: { post: Post }) {
  const likeCount = getLikeCount(post.likeCount);

  return (
    <Link
      href={ROUTES.BOARD_DETAIL(post.id.toString())}
      className="rounded-[20px] border border-background-tertiary px-4 py-4 h-35 md:h-39 md:px-6 md:py-5 block"
    >
      <div className="h-20 flex items-start justify-between gap-4 md:h-22">
        <div className="flex-1 min-w-0 md:w-90">
          <p className="text-text-primary text-base font-bold line-clamp-1 leading-4.75 md:text-lg md:leading-5.25">
            {post.title}
          </p>
          <p className="text-text-default text-sm font-normal leading-4.25 mt-2 line-clamp-2 md:leading-5">
            {post.content}
          </p>
        </div>
        {post.image && (
          <div className="shrink-0 rounded-lg overflow-hidden w-20 h-20 md:w-22 md:h-22">
            <BoardPostImageWithFallback
              src={post.image}
              alt={`${post.title} 게시글 이미지`}
              width={80}
              height={80}
              className="object-cover object-center h-full w-full md:w-22 md:h-22"
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mt-3 min-w-0">
        <div className="flex min-w-0 flex-1 items-center">
          <span className="text-text-primary text-sm font-medium leading-4 min-w-0 truncate md:text-base">
            {post.writer.nickname}
          </span>
          <span className="text-text-primary text-sm font-medium leading-4 shrink-0 px-2 md:text-base">
            |
          </span>
          <span className="text-interaction-inactive text-sm font-medium leading-4 shrink-0 md:text-base">
            {formatDateToYmd(post.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IcHeartSmall
            width={16}
            height={16}
            role="img"
            aria-label="좋아요 모양 아이콘"
          />
          <span className="text-interaction-inactive text-sm font-medium leading-4">
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
