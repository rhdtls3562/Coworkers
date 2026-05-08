import type { ReactNode } from 'react';

export type RightPanelComment = {
  authorId?: string;
  authorImage?: string;
  author: string;
  content: string;
  id: string;
  isMine?: boolean;
  meta: string;
};

export type RightPanelContent = {
  ariaLabel?: string;
  body?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  headerAction?: ReactNode;
  meta?: ReactNode;
  title?: ReactNode;
};

export type RightPanelProps = RightPanelContent & {
  isRendered: boolean;
  isVisible: boolean;
  onClose: () => void;
};

export type RightPanelShellProps = RightPanelContent & {
  className?: string;
  onClose: () => void;
};

export type RightPanelCloseButtonProps = {
  onClose: () => void;
};

export type TaskDetailPanelBodyProps = {
  commentCount: number;
  comments: readonly RightPanelComment[];
  description: string;
  draftCommentContent: string;
  draftDescription: string;
  editingCommentId: string | null;
  isCommentSubmitting: boolean;
  isSubmittingNewComment: boolean;
  isTaskEditing: boolean;
  onCancelCommentEdit: () => void;
  onChangeDraftCommentContent: (value: string) => void;
  onChangeDraftDescription: (value: string) => void;
  onCreateComment: (content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void> | void;
  onStartCommentEdit: (comment: RightPanelComment) => void;
  onSubmitCommentEdit: () => Promise<void> | void;
};

export type TaskDetailPanelContentProps = {
  apiTeamId: string;
  assigneeName: string;
  completionActionDoneValue?: boolean;
  completionActionLabel?: string;
  description: string;
  frequency: string;
  initialMode?: 'view' | 'edit';
  startedAt: string;
  taskId: string;
  taskListId: string;
  teamId: string;
  title: string;
};

export type TaskDetailPanelFooterProps = {
  completionActionLabel?: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onToggleCompletion: () => Promise<boolean> | void;
  onSubmitEdit: () => Promise<boolean> | void;
};

export type TaskDetailPanelHeaderProps = {
  draftTitle: string;
  isEditing: boolean;
  onChangeDraftTitle: (value: string) => void;
  onDelete: () => void;
  onStartEdit: () => void;
  title: string;
};

export type TaskDetailPanelMetaProps = {
  assigneeName: string;
  frequency: string;
  startedAt: string;
};

export type TaskDetailCommentsSectionProps = {
  commentCount: number;
  comments: readonly RightPanelComment[];
  draftCommentContent: string;
  editingCommentId: string | null;
  isCommentSubmitting: boolean;
  isSubmittingNewComment: boolean;
  onCancelCommentEdit: () => void;
  onChangeDraftCommentContent: (value: string) => void;
  onCreateComment: (content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string) => Promise<void> | void;
  onStartCommentEdit: (comment: RightPanelComment) => void;
  onSubmitCommentEdit: () => Promise<void> | void;
};

export type TaskDetailCommentItemProps = {
  comment: RightPanelComment;
  draftContent: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onChangeDraftContent: (value: string) => void;
  onDelete: () => Promise<void> | void;
  onStartEdit: () => void;
  onSubmitEdit: () => Promise<void> | void;
};

export type TaskDetailCommentActionsProps = {
  isPrimaryDisabled?: boolean;
  onCancel: () => void;
  onPrimaryAction: () => Promise<void> | void;
  primaryLabel: string;
};

export type UseTaskDetailCommentsParams = {
  apiTeamId: string;
  groupId: string;
  taskId: string;
};

export type UseTaskDetailDraftStateParams = {
  initialDescription: string;
  initialMode?: 'view' | 'edit';
  initialTitle: string;
};

export type UseTaskDetailPanelParams = UseTaskDetailDraftStateParams &
  UseTaskDetailCommentsParams & {
    completionActionDoneValue: boolean;
    taskListId: string;
  };

export type UseTaskDetailTaskActionsParams = {
  completionActionDoneValue: boolean;
  currentDoneState: boolean;
  draftDescription: string;
  draftTitle: string;
  taskId: string;
  taskListId: string;
  teamId: string;
};
