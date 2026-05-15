/**
 * 게시글 폼 유틸리티 함수
 */

import type { ApiError, ArticleBody } from '@/api/types';
import { ARTICLE_SUBMIT_FALLBACK } from '@/app/(service)/boards/constants';
import type { ArticleSubmitAction } from '@/app/(service)/boards/types';

export const isRequiredTextValid = (value: string) => {
  return value.trim().length > 0;
};

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

type BuildArticleMutationBodyOptions = {
  /** true면 이미지가 없을 때도 `image: null`을 넣어 PATCH에서 기존 이미지를 제거할 수 있게 합니다. */
  includeNullImage?: boolean;
};

export function buildArticleMutationBody(
  params: {
    title: string;
    content: string;
    image: string | null | undefined;
  },
  options?: BuildArticleMutationBodyOptions,
): ArticleBody {
  const { title, content, image } = params;
  const normalizedImage = normalizeArticleImageUrl(image);
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (normalizedImage != null) {
    return {
      content: trimmedContent,
      title: trimmedTitle,
      image: normalizedImage,
    };
  }

  if (options?.includeNullImage) {
    return {
      content: trimmedContent,
      title: trimmedTitle,
      image: null,
    };
  }

  return {
    content: trimmedContent,
    title: trimmedTitle,
  };
}
