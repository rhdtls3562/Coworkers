import TaskDetailCommentInput from '@/components/common/rightPanel/components/TaskDetailCommentInput';
import TaskDetailCommentItem from '@/components/common/rightPanel/components/TaskDetailCommentItem';
import type { TaskDetailCommentsSectionProps } from '@/components/common/rightPanel/types';

export default function TaskDetailCommentsSection({
  commentCount,
  comments,
  draftCommentContent,
  editingCommentId,
  isCommentSubmitting,
  isSubmittingNewComment,
  onCancelCommentEdit,
  onChangeDraftCommentContent,
  onCreateComment,
  onDeleteComment,
  onStartCommentEdit,
  onSubmitCommentEdit,
}: TaskDetailCommentsSectionProps) {
  return (
    <section className="mt-8 md:mt-9">
      <h3 className="text-lg font-bold text-text-primary md:text-xl">
        댓글 <span className="text-brand-primary">{commentCount}</span>
      </h3>

      <div className="mt-4">
        <TaskDetailCommentInput
          isSubmitting={isSubmittingNewComment}
          onSubmit={onCreateComment}
        />
      </div>

      <ul className="mt-5 divide-y divide-background-tertiary">
        {comments.map((comment) => (
          <TaskDetailCommentItem
            key={comment.id}
            comment={comment}
            draftContent={draftCommentContent}
            isEditing={editingCommentId === comment.id}
            isSubmitting={isCommentSubmitting}
            onCancelEdit={onCancelCommentEdit}
            onChangeDraftContent={onChangeDraftCommentContent}
            onDelete={() => {
              onDeleteComment(comment.id);
            }}
            onStartEdit={() => {
              onStartCommentEdit(comment);
            }}
            onSubmitEdit={onSubmitCommentEdit}
          />
        ))}
      </ul>
    </section>
  );
}
