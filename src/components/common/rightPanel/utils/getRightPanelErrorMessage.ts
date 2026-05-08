/**
 * 오른쪽 패널 mutation 에러를 사용자 메시지로 정리하는 유틸입니다.
 */

export default function getRightPanelErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
