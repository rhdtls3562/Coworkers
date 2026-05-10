import { ContentTextarea } from '@/components/common/form';
import TaskDetailCommentsSection from '@/components/common/rightPanel/components/TaskDetailCommentsSection';
import type { TaskDetailPanelBodyProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelBody({
  commentCount,
  comments,
  currentUserImage,
  description,
  draftCommentContent,
  draftDescription,
  editingCommentId,
  isCommentSubmitting,
  isSubmittingNewComment,
  isTaskEditing,
  onCancelCommentEdit,
  onChangeDraftCommentContent,
  onChangeDraftDescription,
  onCreateComment,
  onDeleteComment,
  onStartCommentEdit,
  onSubmitCommentEdit,
}: TaskDetailPanelBodyProps) {
  return (
    <div className="mt-6 border-t border-background-tertiary pt-6 md:mt-7 md:pt-7">
      {isTaskEditing ? (
        <ContentTextarea
          value={draftDescription}
          placeholder="내용을 입력하세요."
          className="min-h-24 md:min-h-28"
          onChange={(event) => {
            onChangeDraftDescription(event.target.value);
          }}
        />
      ) : (
        <p className="text-sm font-medium leading-6 text-text-secondary md:text-base">
          {description}
        </p>
      )}

      <TaskDetailCommentsSection
        commentCount={commentCount}
        comments={comments}
        currentUserImage={currentUserImage}
        draftCommentContent={draftCommentContent}
        editingCommentId={editingCommentId}
        isCommentSubmitting={isCommentSubmitting}
        isSubmittingNewComment={isSubmittingNewComment}
        onCancelCommentEdit={onCancelCommentEdit}
        onChangeDraftCommentContent={onChangeDraftCommentContent}
        onCreateComment={onCreateComment}
        onDeleteComment={onDeleteComment}
        onStartCommentEdit={onStartCommentEdit}
        onSubmitCommentEdit={onSubmitCommentEdit}
      />
    </div>
  );
}
