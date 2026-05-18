'use client';

import useBoardSearch from '@/app/(service)/boards/hooks/useBoardSearch';
import type { BoardListSortValue } from '@/app/(service)/boards/types';
import { IcSearchXlarge } from '@/assets';

type BoardSearchProps = {
  listSort: BoardListSortValue;
};

export default function BoardSearch({ listSort }: BoardSearchProps) {
  const { keyword, handleChange, handleSubmit } = useBoardSearch({ listSort });

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:max-w-105">
      <div className="absolute inset-y-0 left-3 top-0.5 flex items-center pointer-events-none md:left-4">
        <IcSearchXlarge
          width={24}
          height={24}
          className="md:w-8 md:h-8"
          role="img"
          aria-label="검색"
        />
      </div>
      <input
        type="text"
        name="keyword"
        value={keyword}
        onChange={handleChange}
        placeholder="검색어를 입력해주세요"
        className="w-full h-12 px-12 py-3 text-text-default text-base font-normal leading-4.75
        rounded-full border-2 border-brand-primary 
        focus:outline-none focus:ring-0 
        md:h-14 md:px-15 md:py-4"
      />
    </form>
  );
}
