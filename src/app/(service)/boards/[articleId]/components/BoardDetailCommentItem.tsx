import CommentEditingContent from '@/app/(service)/boards/[articleId]/components/CommentEditingContent';
import CommentReadonlyContent from '@/app/(service)/boards/[articleId]/components/CommentReadonlyContent';
import { useBoardDetailCommentItem } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailCommentItem';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';

export default function BoardDetailCommentItem({
  articleId,
  comment,
  currentUserId,
  onDeleteSuccess,
}: {
  articleId: number;
  comment: Comment;
  currentUserId?: number | null;
  onDeleteSuccess: () => void;
}) {
  const {
    isOwnComment,
    isEditing,
    isDeleteModalOpen,
    menuItems,
    handleSubmitEdit,
    handleCancelEdit,
    editedContent,
    handleEditedContentChange,
    handleDeleteConfirm,
    setIsDeleteModalOpen,
  } = useBoardDetailCommentItem({
    articleId,
    comment,
    currentUserId,
    onDeleteSuccess,
  });

  return (
    <>
      {isOwnComment && isEditing ? (
        <CommentEditingContent
          comment={comment}
          editedContent={editedContent}
          onChangeEditedContent={handleEditedContentChange}
          onCancelEdit={handleCancelEdit}
          onEdit={handleSubmitEdit}
        />
      ) : (
        <CommentReadonlyContent
          comment={comment}
          menuItems={menuItems}
          isDeleteModalOpen={isDeleteModalOpen}
          onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
          onDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
