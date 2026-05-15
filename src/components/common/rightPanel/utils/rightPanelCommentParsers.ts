/**
 * 할 일 댓글 응답을 오른쪽 패널 전용 댓글 모델로 변환하는 유틸입니다.
 */

import type { RightPanelComment } from '@/components/common/rightPanel/types';
import { formatRelativeTime } from '@/utils/formatDate';

type CommentRecord = Record<string, unknown>;

function isRecord(value: unknown): value is CommentRecord {
  return typeof value === 'object' && value !== null;
}

function toCommentMeta(createdAt: unknown, updatedAt: unknown) {
  const baseDate = typeof updatedAt === 'string' ? updatedAt : createdAt;

  if (typeof baseDate !== 'string') {
    return '';
  }

  const parsedDate = new Date(baseDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsedDate);
}

export function formatCommentTime(createdAt: string | null): string {
  return formatRelativeTime(createdAt);
}

export function toRightPanelComments(
  data: unknown,
  currentUserId?: string,
): RightPanelComment[] {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.reduce<RightPanelComment[]>((comments, comment) => {
    if (!isRecord(comment)) {
      return comments;
    }

    const user = isRecord(comment.user) ? comment.user : null;
    const commentId =
      typeof comment.id === 'number' || typeof comment.id === 'string'
        ? String(comment.id)
        : null;
    const content =
      typeof comment.content === 'string' ? comment.content : null;
    const authorId =
      typeof user?.id === 'number' || typeof user?.id === 'string'
        ? String(user.id)
        : undefined;

    if (!commentId || !content) {
      return comments;
    }

    comments.push({
      author: typeof user?.nickname === 'string' ? user.nickname : '사용자',
      authorId,
      authorImage: typeof user?.image === 'string' ? user.image : undefined,
      content,
      id: commentId,
      isMine: Boolean(authorId && currentUserId && authorId === currentUserId),
      meta: toCommentMeta(comment.createdAt, comment.updatedAt),
      createdAt:
        typeof comment.createdAt === 'string' ? comment.createdAt : null,
    });

    return comments;
  }, []);
}
