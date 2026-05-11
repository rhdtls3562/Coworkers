/**
 * 오른쪽 패널의 댓글 조회/생성/수정/삭제를 담당하는 훅입니다.
 */

'use client';

import { useMemo } from 'react';

import type {
  RightPanelComment,
  UseTaskDetailCommentsParams,
} from '@/components/common/rightPanel/types';
import { toRightPanelComments } from '@/components/common/rightPanel/utils/rightPanelCommentParsers';
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
    } catch {
      return false;
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!content.trim()) {
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
      return true;
    } catch {
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
    } catch {
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
