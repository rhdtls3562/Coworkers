import CommentEditingContent from '@/app/(service)/boards/[articleId]/components/CommentEditingContent';
import CommentReadonlyContent from '@/app/(service)/boards/[articleId]/components/CommentReadonlyContent';
import { useBoardDetailCommentItem } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailCommentItem';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';

export default function BoardDetailCommentItem({
  comment,
  currentUserId,
}: {
  comment: Comment;
  currentUserId?: number | null;
}) {
  const {
    isOwnComment,
    isEditing,
    isDeleteModalOpen,
    menuItems,
    handleEdit,
    handleCancelEdit,
    editedContent,
    handleEditedContentChange,
    handleDeleteConfirm,
    setIsDeleteModalOpen,
  } = useBoardDetailCommentItem({ comment, currentUserId });

  return (
    <>
      {isOwnComment && isEditing ? (
        <CommentEditingContent
          comment={comment}
          editedContent={editedContent}
          onChangeEditedContent={handleEditedContentChange}
          onCancelEdit={handleCancelEdit}
          onEdit={handleEdit}
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
