/** 브라우저 환경 여부를 확인하는 유틸 함수 파일입니다. */

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
