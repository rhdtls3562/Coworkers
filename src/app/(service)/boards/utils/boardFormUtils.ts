/**
 * 게시글 폼 유틸리티 함수
 */

import type { ApiError, ArticleBody } from '@/api/types';
import { ARTICLE_SUBMIT_FALLBACK } from '@/app/(service)/boards/constants';

export const isRequiredTextValid = (value: string) => {
  return value.trim().length > 0;
};

export type ArticleSubmitAction = 'create' | 'update';

function isApiError(error: unknown): error is ApiError {
  if (!(error instanceof Error)) {
    return false;
  }

  const status = Reflect.get(error, 'status');
  return typeof status === 'number';
}

export function getArticleSubmitErrorMessage(
  error: unknown,
  action: ArticleSubmitAction,
): string {
  if (!isApiError(error)) {
    return ARTICLE_SUBMIT_FALLBACK[action];
  }

  const { status, message } = error;

  if (status === 403) {
    return action === 'create'
      ? '게시글을 등록할 권한이 없습니다.'
      : '게시글은 작성자 본인만 수정할 수 있습니다.';
  }

  if (status === 404) {
    return action === 'update'
      ? '존재하지 않는 게시글입니다.'
      : ARTICLE_SUBMIT_FALLBACK[action];
  }

  if (status === 401 && message) {
    return message;
  }

  return ARTICLE_SUBMIT_FALLBACK[action];
}

export const normalizeArticleImageUrl = (
  value: string | null | undefined,
): string | null => {
  if (value == null || value === '') {
    return null;
  }

  return value;
};

export function buildArticleMutationBody(params: {
  title: string;
  content: string;
  image: string | null | undefined;
}): ArticleBody {
  const { title, content, image } = params;
  const normalizedImage = normalizeArticleImageUrl(image);

  return {
    content: content.trim(),
    title: title.trim(),
    ...(normalizedImage != null ? { image: normalizedImage } : {}),
  };
}
