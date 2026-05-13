'use client';

/**
 * 게시글 상세 댓글 작성란의 초안 상태·등록 mutation·엔터 제출을 묶는 클라이언트 훅입니다.
 */

import { type KeyboardEvent, useState } from 'react';

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import { useCreateArticleCommentMutation } from '@/hooks/useArticleComment';
import { getStoredAccessToken } from '@/utils/authSession';

type UseBoardDetailCommentComposerParams = {
  articleId: number;
  isAuthenticated: boolean;
  onCreateSuccess: () => void;
  onRequireAuth: () => void;
};

export function useBoardDetailCommentComposer({
  articleId,
  isAuthenticated,
  onCreateSuccess,
  onRequireAuth,
}: UseBoardDetailCommentComposerParams) {
  const [draft, setDraft] = useState('');
  const createMutation = useCreateArticleCommentMutation();

  const handleSubmit = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!TEAM_ID) {
      return;
    }

    if (createMutation.isPending) {
      return;
    }

    const token = getStoredAccessToken();

    if (!token) {
      onRequireAuth();
      return;
    }

    const trimmed = draft.trim();

    if (!trimmed) {
      return;
    }

    createMutation.mutate(
      { articleId, body: { content: trimmed }, teamId: TEAM_ID, token },
      {
        onSuccess: () => {
          setDraft('');
          onCreateSuccess();
        },
      },
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    handleSubmit();
  };

  const hasDraft = draft.trim().length > 0;
  const isCreatePending = createMutation.isPending;
  const isSubmitEnabled = isAuthenticated && hasDraft && !isCreatePending;
  const isButtonDisabled = isAuthenticated && !isSubmitEnabled;

  return {
    draft,
    setDraft,
    handleKeyDown,
    handleSubmit,
    isButtonDisabled,
    isSubmitEnabled,
  };
}
