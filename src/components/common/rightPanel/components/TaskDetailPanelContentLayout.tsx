/**
 * 오른쪽 패널 상세 화면의 고정 헤더와 본문 레이아웃을 렌더링하는 컴포넌트입니다.
 */

import TaskDetailPanelBody from '@/components/common/rightPanel/components/TaskDetailPanelBody';
import TaskDetailPanelFooter from '@/components/common/rightPanel/components/TaskDetailPanelFooter';
import TaskDetailPanelHeader from '@/components/common/rightPanel/components/TaskDetailPanelHeader';
import TaskDetailPanelMeta from '@/components/common/rightPanel/components/TaskDetailPanelMeta';
import type { TaskDetailPanelContentLayoutProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelContentLayout({
  assigneeImage,
  assigneeName,
  commentCount,
  comments,
  completionActionLabel,
  currentUserImage,
  description,
  draftCommentContent,
  draftDescription,
  draftTitle,
  editingCommentId,
  frequency,
  isCommentSubmitting,
  isSubmittingNewComment,
  isSubmittingTaskAction,
  isTaskEditing,
  onCancelCommentEdit,
  onChangeDraftCommentContent,
  onChangeDraftDescription,
  onChangeDraftTitle,
  onCreateComment,
  onDelete,
  onDeleteComment,
  onStartCommentEdit,
  onStartEdit,
  onSubmitCommentEdit,
  onSubmitEdit,
  onToggleCompletion,
  scrollContainerRef,
  startedAt,
  title,
}: TaskDetailPanelContentLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 md:px-8 md:pb-10 md:pt-10"
      >
        <div className="-mx-6 sticky top-0 z-10 bg-background-inverse px-6 pb-6 pt-8 md:static md:mx-0 md:px-0 md:pb-0 md:pt-0">
          <TaskDetailPanelHeader
            draftTitle={draftTitle}
            isEditing={isTaskEditing}
            onChangeDraftTitle={onChangeDraftTitle}
            onDelete={onDelete}
            onStartEdit={onStartEdit}
            title={title}
          />

          <div className="mt-5 md:mt-6">
            <TaskDetailPanelMeta
              assigneeImage={assigneeImage}
              assigneeName={assigneeName}
              frequency={frequency}
              startedAt={startedAt}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-background-tertiary pt-6 md:mt-7 md:pt-7">
          <TaskDetailPanelBody
            commentCount={commentCount}
            comments={comments}
            currentUserImage={currentUserImage}
            description={description}
            draftCommentContent={draftCommentContent}
            draftDescription={draftDescription}
            editingCommentId={editingCommentId}
            isCommentSubmitting={isCommentSubmitting}
            isSubmittingNewComment={isSubmittingNewComment}
            isTaskEditing={isTaskEditing}
            onCancelCommentEdit={onCancelCommentEdit}
            onChangeDraftCommentContent={onChangeDraftCommentContent}
            onChangeDraftDescription={onChangeDraftDescription}
            onCreateComment={onCreateComment}
            onDeleteComment={onDeleteComment}
            onStartCommentEdit={onStartCommentEdit}
            onSubmitCommentEdit={onSubmitCommentEdit}
          />
        </div>

        <TaskDetailPanelFooter
          completionActionLabel={completionActionLabel}
          isEditing={isTaskEditing}
          isSubmitting={isSubmittingTaskAction}
          onToggleCompletion={onToggleCompletion}
          onSubmitEdit={onSubmitEdit}
        />
      </div>
    </div>
  );
}
