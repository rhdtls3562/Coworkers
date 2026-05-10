/**
 * 오른쪽 패널의 댓글 조회/생성/수정/삭제를 담당하는 훅입니다.
 */

'use client';

import { useMemo } from 'react';

import type {
  RightPanelComment,
  UseTaskDetailCommentsParams,
} from '@/components/common/rightPanel/types';
import getRightPanelErrorMessage from '@/components/common/rightPanel/utils/getRightPanelErrorMessage';
import { toRightPanelComments } from '@/components/common/rightPanel/utils/rightPanelCommentParsers';
import { useToast } from '@/components/common/toast';
import {
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useTaskCommentsQuery,
  useUpdateTaskCommentMutation,
} from '@/hooks/useTask';
import { useMeQuery } from '@/hooks/useUser';

export default function useTaskDetailComments({
  apiTeamId,
  groupId,
  taskId,
}: UseTaskDetailCommentsParams) {
  const { showToast } = useToast();
  const { data: meData } = useMeQuery();
  const currentUserId =
    typeof meData === 'object' &&
    meData !== null &&
    'id' in meData &&
    (typeof meData.id === 'number' || typeof meData.id === 'string')
      ? String(meData.id)
      : undefined;
  const currentUserImage =
    typeof meData === 'object' &&
    meData !== null &&
    'image' in meData &&
    typeof meData.image === 'string'
      ? meData.image
      : undefined;
  const taskCommentsQuery = useTaskCommentsQuery<RightPanelComment[]>({
    options: {
      enabled: Boolean(apiTeamId && taskId),
      select: (data) => toRightPanelComments(data, currentUserId),
    },
    taskId,
    teamId: apiTeamId,
  });
  const createCommentMutation = useCreateTaskCommentMutation();
  const updateCommentMutation = useUpdateTaskCommentMutation();
  const deleteCommentMutation = useDeleteTaskCommentMutation();
  const comments = useMemo(
    () => taskCommentsQuery.data ?? [],
    [taskCommentsQuery.data],
  );

  const handleCreateComment = async (content: string) => {
    try {
      await createCommentMutation.mutateAsync({
        body: { content },
        groupId,
        taskId,
        teamId: apiTeamId,
      });
      return true;
    } catch (error) {
      showToast(
        getRightPanelErrorMessage(error, '댓글 등록에 실패했습니다.'),
        'error',
      );
      return false;
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!content.trim()) {
      showToast('댓글 내용을 입력해주세요.', 'error');
      return false;
    }

    try {
      await updateCommentMutation.mutateAsync({
        body: { content },
        commentId,
        groupId,
        taskId,
        teamId: apiTeamId,
      });
      showToast('댓글이 수정되었습니다.', 'success');
      return true;
    } catch (error) {
      showToast(
        getRightPanelErrorMessage(error, '댓글 수정에 실패했습니다.'),
        'error',
      );
      return false;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({
        commentId,
        groupId,
        taskId,
        teamId: apiTeamId,
      });
      return true;
    } catch (error) {
      showToast(
        getRightPanelErrorMessage(error, '댓글 삭제에 실패했습니다.'),
        'error',
      );
      return false;
    }
  };

  return {
    comments,
    currentUserImage,
    currentUserId,
    handleCreateComment,
    handleDeleteComment,
    handleUpdateComment,
    isCommentSubmitting:
      updateCommentMutation.isPending || deleteCommentMutation.isPending,
    isLoadingComments: taskCommentsQuery.isLoading,
    isSubmittingNewComment: createCommentMutation.isPending,
  };
}
