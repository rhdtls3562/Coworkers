/**
 * 댓글 입력란 프로필 아바타의 alt·폴백 aria-label에 쓰일 문자열을 만드는 유틸입니다.
 */

export function getBoardCommentComposerProfileAvatarAccessibleLabel(
  isGuest: boolean,
  nickname: string,
): string {
  if (isGuest) {
    return '게스트 프로필 이미지';
  }
  return `${nickname}의 프로필 이미지`;
}
