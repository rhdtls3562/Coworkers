'use client';

/**
 * 게시글 상세 댓글 작성란의 초안 상태·등록 mutation·엔터 제출을 묶는 클라이언트 훅입니다.
 */

import { type KeyboardEvent, useState } from 'react';

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import { useToast } from '@/components/common/toast';
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
  const { showToast } = useToast();
  const [draft, setDraft] = useState('');
  const createMutation = useCreateArticleCommentMutation();

  const handleSubmit = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!TEAM_ID) {
      showToast('팀 정보가 설정되지 않았습니다.', 'error');
      return;
    }

    if (createMutation.isPending) {
      return;
    }

    const token = getStoredAccessToken();

    if (!token) {
      showToast('로그인이 필요합니다.', 'error');
      onRequireAuth();
      return;
    }

    const trimmed = draft.trim();

    if (!trimmed) {
      showToast('댓글 내용을 입력해주세요.', 'error');
      return;
    }

    createMutation.mutate(
      { articleId, body: { content: trimmed }, teamId: TEAM_ID, token },
      {
        onSuccess: () => {
          setDraft('');
          onCreateSuccess();
        },
        onError: () => {
          showToast('댓글 등록에 실패했습니다. 다시 시도해주세요.', 'error');
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

  return {
    draft,
    setDraft,
    handleSubmit,
    handleKeyDown,
    isCreatePending: createMutation.isPending,
  };
}
