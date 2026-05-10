/**
 * 게시글 수정 미저장 가드에서 포인터/클릭 차단 여부를 판별합니다.
 * 우측 패널 가드와 동일한 허용·차단 규칙에서 패널 전용 셀렉터만 제외했습니다.
 */

const BOARD_EDIT_ALLOWED_UNSAVED_SELECTOR =
  '[data-allow-unsaved="true"], [data-toast-action="true"], input, textarea, label';

const BOARD_EDIT_INTERACTIVE_SELECTOR = 'a[href], button, [role="button"]';

export default function shouldBlockBoardEditInteraction(
  target: EventTarget | null,
) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest(BOARD_EDIT_ALLOWED_UNSAVED_SELECTOR)) {
    return false;
  }

  return Boolean(target.closest(BOARD_EDIT_INTERACTIVE_SELECTOR));
}
