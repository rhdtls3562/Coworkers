'use client';

/**
 * 댓글 목록을 본인 작성 우선·작성 시각 순으로 정렬해 반환하는 훅입니다.
 */

import { useMemo } from 'react';

import {
  MOVE_TO_BACK,
  MOVE_TO_FRONT,
} from '@/app/(service)/boards/[articleId]/constants';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { parseCommentDateToTime } from '@/app/(service)/boards/[articleId]/utils/parseCommentDateToTime';

type UseSortedCommentsParams = {
  comments: Comment[];
  userId?: number | null;
};

export const useSortedComments = ({
  comments,
  userId,
}: UseSortedCommentsParams) => {
  return useMemo(
    () =>
      [...comments].sort((a, b) => {
        const isAOwnComment = a.writer.id === userId;
        const isBOwnComment = b.writer.id === userId;

        if (isAOwnComment !== isBOwnComment) {
          return isAOwnComment ? MOVE_TO_FRONT : MOVE_TO_BACK;
        }

        return (
          parseCommentDateToTime(b.createdAt) -
          parseCommentDateToTime(a.createdAt)
        );
      }),
    [comments, userId],
  );
};
