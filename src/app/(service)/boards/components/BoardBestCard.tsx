import Link from 'next/link';

import BoardPostImageWithFallback from '@/app/(service)/boards/components/BoardPostImageWithFallback';
import type { Post } from '@/app/(service)/boards/types';
import {
  formatDateToYmd,
  getLikeCount,
} from '@/app/(service)/boards/utils/boardDisplayUtils';
import { IcBoardBest, IcHeartSmall } from '@/assets';
import { ROUTES } from '@/constants/ROUTES';

export default function BoardBestCard({ post }: { post: Post }) {
  const likeCount = getLikeCount(post.likeCount);

  return (
    <Link
      href={ROUTES.BOARD_DETAIL(post.id.toString())}
      className="p-5 bg-background-primary rounded-[20px] block border border-border-primary"
    >
      <div className="inline-flex shrink-0 items-center gap-1 bg-background-secondary rounded-full px-3 py-1.5 h-7.5 whitespace-nowrap">
        <IcBoardBest
          width={18}
          height={18}
          className="shrink-0 fill-brand-primary"
          role="img"
          aria-label="베스트 게시글 따봉 모양 아이콘"
        />
        <p className="shrink-0 text-brand-primary text-sm font-bold leading-4.25">
          인기
        </p>
      </div>
      <div className="min-h-12 flex flex-row items-start justify-between gap-3 mt-3 md:min-h-14.75 lg:mt-4 lg:min-h-17.25">
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <p className="text-text-primary text-base font-bold line-clamp-1 leading-4.75 lg:text-lg lg:leading-5.25">
            {post.title}
          </p>
          <div className="mt-1.5 min-h-10.5 overflow-hidden lg:mt-2">
            <p className="text-text-default text-sm font-normal leading-4.25 line-clamp-2 lg:text-base lg:leading-5">
              {post.content}
            </p>
          </div>
        </div>
        <div className="shrink-0 self-center">
          {post.image && (
            <div className="rounded-lg overflow-hidden w-12 h-12 lg:w-15 lg:h-15">
              <BoardPostImageWithFallback
                src={post.image}
                alt={`${post.title} 게시글 이미지`}
                width={48}
                height={48}
                className="object-cover object-center h-full w-full lg:w-15 lg:h-15"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-3 lg:mt-4.25 min-w-0">
        <div className="flex min-w-0 flex-1 items-center">
          <span className="text-text-primary text-sm font-medium leading-4 min-w-0 truncate lg:leading-4.25">
            {post.writer.nickname}
          </span>
          <span className="text-text-primary text-sm font-medium leading-4 shrink-0 px-2 lg:leading-4.25">
            |
          </span>
          <span className="text-interaction-inactive text-sm font-medium leading-4 shrink-0 lg:leading-4.25">
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
          <span className="text-interaction-inactive text-sm font-medium leading-4 lg:leading-4.25">
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
