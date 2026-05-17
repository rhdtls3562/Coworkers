/** 게시판 목록 페이지 헤더(검색·정렬) 컴포넌트입니다. */

import { Suspense } from 'react';

import BoardSearch from '@/app/(service)/boards/components/BoardSearch';
import type { BoardListSortValue } from '@/app/(service)/boards/types';

type BoardHeaderProps = {
  listSort: BoardListSortValue;
};

export default function BoardHeader({ listSort }: BoardHeaderProps) {
  return (
    <section className="max-w-324.5 px-4 pt-6.25 md:pt-19.25 md:px-6.5 lg:px-22.25 lg:pt-21.75">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-10">
        <h2 className="shrink-0 text-text-primary text-xl font-bold leading-6 md:text-2xl md:leading-7">
          채용 / 홍보
        </h2>
        <Suspense
          fallback={
            <div className="relative w-full md:max-w-105">
              <div className="w-full h-12 rounded-full border-2 border-brand-primary md:h-14" />
            </div>
          }
        >
          <BoardSearch listSort={listSort} />
        </Suspense>
      </div>
    </section>
  );
}
