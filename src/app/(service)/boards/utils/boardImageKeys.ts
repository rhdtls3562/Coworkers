export const BOARD_REMOTE_IMAGE_NONE_KEY = 'board-remote-image-none';

export function getBoardImageRemountKey(
  url: string | null | undefined,
  noneKey: string = BOARD_REMOTE_IMAGE_NONE_KEY,
): string {
  return url ?? noneKey;
}
