/**
 * 리스트 페이지 주간 날짜 스트립의 스크롤/키 유틸입니다.
 */

export function getTaskListCalendarDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function centerTaskListDayInScrollParent(
  scrollParent: HTMLElement,
  child: HTMLElement,
  behavior: ScrollBehavior = 'auto',
) {
  const parentRect = scrollParent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const childCenterX = childRect.left + childRect.width / 2;
  const parentCenterX = parentRect.left + parentRect.width / 2;
  const delta = childCenterX - parentCenterX;
  const maxScroll = Math.max(
    0,
    scrollParent.scrollWidth - scrollParent.clientWidth,
  );
  const next = scrollParent.scrollLeft + delta;
  const left = Math.max(0, Math.min(next, maxScroll));

  scrollParent.scrollTo({ left, behavior });
}
