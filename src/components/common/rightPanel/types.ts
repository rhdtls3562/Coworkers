import type { ReactNode } from 'react';

export type RightPanelComment = {
  author: string;
  content: string;
  id: string;
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
  isTaskEditing: boolean;
  onCancelCommentEdit: () => void;
  onChangeDraftCommentContent: (value: string) => void;
  onChangeDraftDescription: (value: string) => void;
  onDeleteComment: (commentId: string) => void;
  onStartCommentEdit: (comment: RightPanelComment) => void;
  onSubmitCommentEdit: () => void;
};

export type TaskDetailPanelContentProps = {
  assigneeName: string;
  comments: readonly RightPanelComment[];
  completionActionLabel?: string;
  description: string;
  frequency: string;
  initialMode?: 'view' | 'edit';
  startedAt: string;
  title: string;
};

export type TaskDetailPanelFooterProps = {
  completionActionLabel?: string;
  isEditing: boolean;
  onSubmitEdit: () => void;
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
  onCancelCommentEdit: () => void;
  onChangeDraftCommentContent: (value: string) => void;
  onDeleteComment: (commentId: string) => void;
  onStartCommentEdit: (comment: RightPanelComment) => void;
  onSubmitCommentEdit: () => void;
};

export type TaskDetailCommentItemProps = {
  comment: RightPanelComment;
  draftContent: string;
  isEditing: boolean;
  onCancelEdit: () => void;
  onChangeDraftContent: (value: string) => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onSubmitEdit: () => void;
};

export type TaskDetailCommentActionsProps = {
  onCancel: () => void;
  onPrimaryAction: () => void;
  primaryLabel: string;
};
