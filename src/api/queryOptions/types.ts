/**
 * query options 파일에서 공통으로 참조하는 응답 데이터 타입 모음입니다.
 */

export type ArticleDetailData = Awaited<
  ReturnType<typeof import('@/api/articleApi').getArticleDetail>
>;
export type ArticleListData = Awaited<
  ReturnType<typeof import('@/api/articleApi').getArticleList>
>;
export type TaskCommentsData = Awaited<
  ReturnType<typeof import('@/api/commentApi').getTaskComments>
>;
export type ArticleCommentsData = Awaited<
  ReturnType<typeof import('@/api/commentApi').getArticleComments>
>;
export type TaskDetailData = Awaited<
  ReturnType<typeof import('@/api/taskApi').getTaskDetail>
>;
export type TasksData = Awaited<
  ReturnType<typeof import('@/api/taskApi').getTasks>
>;
export type TaskListDetailData = Awaited<
  ReturnType<typeof import('@/api/taskApi').getTaskListDetail>
>;
export type TeamDetailData = Awaited<
  ReturnType<typeof import('@/api/groupApi').getTeamDetail>
>;
export type TeamTasksByDateData = Awaited<
  ReturnType<typeof import('@/api/groupApi').getTeamTasksByDate>
>;
export type CompletedTasksData = Awaited<
  ReturnType<typeof import('@/api/userApi').getCompletedTasks>
>;
export type MyGroupsData = Awaited<
  ReturnType<typeof import('@/api/userApi').getMyGroups>
>;
export type MeData = Awaited<ReturnType<typeof import('@/api/userApi').getMe>>;
export type MyMembershipsData = Awaited<
  ReturnType<typeof import('@/api/userApi').getMyMemberships>
>;
