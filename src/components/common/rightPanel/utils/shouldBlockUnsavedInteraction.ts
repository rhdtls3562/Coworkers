/** 오른쪽 패널 미저장 상태일 때 외부 인터랙션을 차단해야 하는지 판단하는 유틸입니다. */

import {
  RIGHT_PANEL_ALLOWED_UNSAVED_SELECTOR,
  RIGHT_PANEL_INTERACTIVE_SELECTOR,
} from '@/components/common/rightPanel/constants';

export default function shouldBlockUnsavedInteraction(
  target: EventTarget | null,
) {
  if (!(target instanceof Element)) {
    return false;
  }

  if (target.closest(RIGHT_PANEL_ALLOWED_UNSAVED_SELECTOR)) {
    return false;
  }

  if (target.closest('[data-right-panel-close="true"]')) {
    return true;
  }

  return Boolean(target.closest(RIGHT_PANEL_INTERACTIVE_SELECTOR));
}
