/**
 * 게시글 헤더 아바타에 표시할 이미지 URL과 작성자(본인) 여부를 계산하는 유틸입니다.
 */

type GetBoardHeaderAvatarImageParams = {
  currentUserId?: number;
  currentUserImage?: string | null;
  writerId: number;
  writerImage?: string | null;
};

export function getBoardHeaderAvatarImage({
  currentUserId,
  currentUserImage,
  writerId,
  writerImage,
}: GetBoardHeaderAvatarImageParams) {
  const isOwner = writerId === currentUserId;

  return {
    headerAvatarImage: isOwner
      ? (currentUserImage ?? writerImage ?? null)
      : (writerImage ?? null),
    isOwner,
  };
}
