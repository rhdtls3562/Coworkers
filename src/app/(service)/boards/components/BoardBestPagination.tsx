import type { BestPagination } from '@/app/(service)/boards/types';
import { IcChevronLeftSmall, IcChevronRightSmall } from '@/assets';
import { cn } from '@/utils/cn';

export default function BoardBestPagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: BestPagination & { setCurrentPage: (page: number) => void }) {
  const handlePrevPage = () => {
    const prevPage = currentPage <= 1 ? totalPages : currentPage - 1;
    setCurrentPage(prevPage);
  };
  const handleNextPage = () => {
    const nextPage = currentPage >= totalPages ? 1 : currentPage + 1;
    setCurrentPage(nextPage);
  };
  return (
    <div className="relative flex items-center justify-end mt-4.5 md:mt-4 lg:mt-5.5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            type="button"
            onClick={() => setCurrentPage(index + 1)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              currentPage === index + 1
                ? 'w-4 bg-interaction-inactive'
                : 'w-2 bg-border-secondary cursor-pointer',
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrevPage}
          className="w-6 h-6 bg-background-primary rounded-full border border-border-secondary cursor-pointer lg:w-8 lg:h-8"
        >
          <IcChevronLeftSmall
            width={16}
            height={16}
            className="block mx-auto"
            role="img"
            aria-label="이전 페이지"
          />
        </button>
        <button
          type="button"
          onClick={handleNextPage}
          className="w-6 h-6 bg-background-primary rounded-full border border-border-secondary cursor-pointer lg:w-8 lg:h-8"
        >
          <IcChevronRightSmall
            width={16}
            height={16}
            className="block mx-auto"
            role="img"
            aria-label="다음 페이지"
          />
        </button>
      </div>
    </div>
  );
}
