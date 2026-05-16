import { ContentTextarea } from '@/components/common/form';
import TaskDetailCommentsSection from '@/components/common/rightPanel/components/TaskDetailCommentsSection';
import type { TaskDetailPanelBodyProps } from '@/components/common/rightPanel/types';
import { MEMO_TEXT_LIMIT } from '@/constants/TEXT_LIMIT';

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
    <>
      {isTaskEditing ? (
        <>
          <ContentTextarea
            value={draftDescription}
            placeholder="내용을 입력하세요."
            className="min-h-24 md:min-h-28"
            maxLength={MEMO_TEXT_LIMIT}
            onChange={(event) => {
              onChangeDraftDescription(event.target.value);
            }}
          />
          <div className="flex items-center justify-between mt-1">
            {draftDescription.length >= MEMO_TEXT_LIMIT ? (
              <p className="text-sm font-medium text-status-danger">
                {MEMO_TEXT_LIMIT}자 이내로 작성해주세요.
              </p>
            ) : (
              <span />
            )}
            <p className="text-right text-sm text-text-default">
              {draftDescription.length}/{MEMO_TEXT_LIMIT}
            </p>
          </div>
        </>
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
    </>
  );
}
