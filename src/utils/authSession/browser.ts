export function isBrowser() {
  return typeof window !== 'undefined';
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
