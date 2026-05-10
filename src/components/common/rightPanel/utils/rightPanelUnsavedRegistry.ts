let rightPanelUnsavedGuard: (() => void) | null = null;

export function registerRightPanelUnsavedGuard(guard: (() => void) | null) {
  rightPanelUnsavedGuard = guard;
}

export function getRightPanelUnsavedGuard() {
  return rightPanelUnsavedGuard;
}
