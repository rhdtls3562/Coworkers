/** 게시글 상세 페이지 오류/접근 불가 시 표시하는 폴백 컴포넌트입니다. */

type BoardDetailPageFallbackProps = {
  message: string;
};

export default function BoardDetailPageFallback({
  message,
}: BoardDetailPageFallbackProps) {
  return (
    <div className="w-full h-full min-h-dvh flex justify-center items-center px-4 py-8 md:px-6.5 md:py-18 lg:py-17">
      <div className="max-w-225 w-full rounded-[20px] bg-background-primary px-5.5 py-9.75 text-center md:px-10 md:py-13.5 lg:px-15">
        <p className="text-sm text-text-default md:text-base">{message}</p>
      </div>
    </div>
  );
}
