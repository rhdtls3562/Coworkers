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
