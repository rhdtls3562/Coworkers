/**
 * 게시판 원격 이미지 컴포넌트 리마운트용 기본 키와 URL 기반 키 생성 유틸입니다.
 */

export const BOARD_REMOTE_IMAGE_NONE_KEY = 'board-remote-image-none';

export function getBoardImageRemountKey(
  url: string | null | undefined,
  noneKey: string = BOARD_REMOTE_IMAGE_NONE_KEY,
): string {
  return url ?? noneKey;
}
