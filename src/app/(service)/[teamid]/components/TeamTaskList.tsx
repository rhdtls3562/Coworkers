export default function TeamTaskList() {
  return (
    <section className="w-full px-4 flex flex-col gap-4 md:px-0 xl:px-0 xl:w-[calc(100%-264px)]">
      <h2 className="text-base text-text-primary font-medium flex gap-1 items-center xl:text-xl">
        할 일 목록
        <span className="text-base text-text-default font-normal">(0개)</span>
      </h2>
      <div className="flex items-center justify-center rounded-2xl bg-background-inverse py-20 text-sm font-normal text-text-default xl:py-40">
        아직 할 일 목록이 없어요.
      </div>
    </section>
  );
}
