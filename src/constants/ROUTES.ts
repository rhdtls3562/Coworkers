/**
 * 프론트 화면 이동에 사용하는 App Router 경로 상수입니다.
 * 백엔드 호출 경로는 여기서 관리하지 않고 `src/api/constants.ts`에서 따로 관리합니다.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  ADD_TEAM: '/addteam',
  JOIN_TEAM: '/jointeam',
  MY_HISTORY: '/myhistory',
  MY_PAGE: '/mypage',
  BOARDS: '/boards',
  BOARD_DETAIL: (articleId: string) => `/boards/${articleId}`,
  TEAM: (teamId: string) => `/${teamId}`,
  TASK_LIST: (teamId: string) => `/${teamId}/tasklist`,
  TASK_LIST_ITEM: (teamId: string, taskId: string) =>
    `/${teamId}/tasklist/${taskId}`,
  TASK_DETAIL: (teamId: string, taskId: string) => `/${teamId}/${taskId}`,
  OAUTH_AUTHORIZE: (provider: string) => `/api/oauth/${provider}/authorize`,
  OAUTH_CALLBACK: (provider: string) => `/oauth/${provider}`,
  OAUTH_SIGNUP: (provider: string) => `/oauth/signup/${provider}`,
} as const;
