/**
 * mutation 성공 후 관련 서버 상태를 다시 불러오는 공통 helper 모음입니다.
 *
 * 내부 구현은 `invalidateQueries`를 사용합니다.
 * 현재 프로젝트에서는 "다시 받아온다"는 의미로 `refetch`라는 이름을 사용합니다.
 */

import type { QueryKeyId } from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import type { RefetchQueryKeysParams } from '@/api/types';

import type { QueryClient } from '@tanstack/react-query';

export async function refetchQueryKeys({
  queryClient,
  queryKeysToRefetch,
}: RefetchQueryKeysParams) {
  await Promise.all(
    queryKeysToRefetch.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    ),
  );
}

export async function refetchUserQueries(queryClient: QueryClient) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.user.me(),
      queryKeys.user.groups(),
      queryKeys.user.memberships(),
    ],
  });
}

export async function refetchArticleListQueries(
  queryClient: QueryClient,
  teamId: string,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [queryKeys.article.lists(teamId)],
  });
}

export async function refetchArticleQueries(
  queryClient: QueryClient,
  teamId: string,
  articleId: QueryKeyId,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.article.detail(teamId, articleId),
      queryKeys.article.lists(teamId),
    ],
  });
}

export async function refetchArticleCommentQueries(
  queryClient: QueryClient,
  teamId: string,
  articleId: QueryKeyId,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.articleComment.article(teamId, articleId),
      queryKeys.article.detail(teamId, articleId),
    ],
  });
}

export async function refetchTaskCommentQueries(
  queryClient: QueryClient,
  teamId: string,
  taskId: QueryKeyId,
  groupId = teamId,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.comment.task(teamId, taskId),
      queryKeys.task.detail(groupId, taskId),
      queryKeys.task.lists(groupId),
      queryKeys.taskList.all(groupId),
    ],
  });
}

export async function refetchTaskQueries(
  queryClient: QueryClient,
  teamId: string,
  taskId: QueryKeyId,
  taskListId: QueryKeyId,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.task.detail(teamId, taskId, taskListId),
      queryKeys.task.lists(teamId),
      queryKeys.taskList.detail(teamId, taskListId),
      queryKeys.taskList.lists(teamId),
      queryKeys.taskList.all(teamId),
      queryKeys.team.detail(teamId),
    ],
  });
}

export async function refetchHistoryTaskQueries(
  queryClient: QueryClient,
  teamId: string,
  taskId: QueryKeyId,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.user.completedTasks(),
      queryKeys.user.completedTaskSummary(),
      queryKeys.task.detail(teamId, taskId),
      queryKeys.task.lists(teamId),
      queryKeys.taskList.all(teamId),
    ],
  });
}

export async function refetchRecurringQueries(
  queryClient: QueryClient,
  teamId: string,
) {
  await refetchQueryKeys({
    queryClient,
    queryKeysToRefetch: [
      queryKeys.task.lists(teamId),
      queryKeys.taskList.lists(teamId),
      queryKeys.recurring.lists(teamId),
    ],
  });
}
