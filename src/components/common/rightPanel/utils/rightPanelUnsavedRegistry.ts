/** 오른쪽 패널의 미저장 변경 가드를 전역으로 등록·해제하는 레지스트리입니다. */

let rightPanelUnsavedGuard: (() => void) | null = null;

export function registerRightPanelUnsavedGuard(guard: (() => void) | null) {
  rightPanelUnsavedGuard = guard;
}

export function getRightPanelUnsavedGuard() {
  return rightPanelUnsavedGuard;
}
