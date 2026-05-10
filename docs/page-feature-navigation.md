# 페이지 / 기능별 API 연결 네비게이션

이 문서는

> “지금 내가 붙이려는 기능은 어느 API 파일과 어느 훅 파일을 보면 되지?”

를 가장 빠르게 찾기 위한 네비게이션입니다.

공통 설명이 필요하면
[react-query-guide.md](./react-query-guide.md)를 먼저 보고,
지금 문서는 **페이지나 기능 기준으로 바로 찾아가는 지도**라고 생각하면 됩니다.

---

## 0. mutation 후 다시 불러오는 공통 helper

생성 / 수정 / 삭제 후 관련 데이터를 다시 받아와야 할 때는
아래 파일도 같이 보면 됩니다.

- [queryRefetch.ts](../src/api/queryRefetch.ts)

여기에는 지금 자주 쓰는 공통 helper가 들어 있습니다.

- `refetchUserQueries`
- `refetchArticleListQueries`
- `refetchArticleQueries`
- `refetchArticleCommentQueries`
- `refetchTaskCommentQueries`
- `refetchRecurringQueries`

즉, 화면에서 mutation을 새로 붙일 때

1. 어떤 훅을 쓸지 찾고
2. 성공 후 어떤 helper를 같이 호출하는지 보면

“왜 이 데이터가 다시 그려지는지”를 훨씬 빨리 이해할 수 있습니다.

---

## 1. 빠르게 찾는 요약

### 인증

**로그인 / 회원가입**

- 라우트: `/login`, `/signup`
- API: [authApi.ts](../src/api/authApi.ts)
- 훅: [useAuth.ts](../src/hooks/useAuth.ts)
- 먼저 찾을 export: `useSignInMutation`, `useSignUpMutation`
- 같이 보면 좋은 refetch helper: `refetchUserQueries`

**OAuth 로그인**

- 라우트: `/oauth/signup/[provider]`
- API: [authApi.ts](../src/api/authApi.ts)
- 훅: [useAuth.ts](../src/hooks/useAuth.ts)
- 먼저 찾을 export: `useSignInWithOauthMutation`, `useRefreshTokenMutation`
- 같이 보면 좋은 refetch helper: `refetchUserQueries`

---

### 내 정보 / 마이페이지

**내 정보 / 프로필**

- 라우트: `/mypage`
- API: [userApi.ts](../src/api/userApi.ts), [imageApi.ts](../src/api/imageApi.ts)
- 훅: [useUser.ts](../src/hooks/useUser.ts), [useImage.ts](../src/hooks/useImage.ts)
- 먼저 찾을 export: `useMeQuery`, `useUploadImageMutation`

**마이 히스토리**

- 라우트: `/myhistory`
- API: [userApi.ts](../src/api/userApi.ts)
- 훅: [useUser.ts](../src/hooks/useUser.ts)
- 먼저 찾을 export: `useCompletedTasksQuery`

---

### 팀 / 할 일

**팀 메인 / 오늘 할 일**

- 라우트: `/{teamid}`
- API: [groupApi.ts](../src/api/groupApi.ts)
- 훅: [useTeam.ts](../src/hooks/useTeam.ts)
- 먼저 찾을 export: `useTeamDetailQuery`, `useTeamTasksByDateQuery`

**할 일 목록(컬럼)**

- 라우트: `/{teamid}/tasklist`
- API: [taskApi.ts](../src/api/taskApi.ts)
- 훅: [useTaskList.ts](../src/hooks/useTaskList.ts)
- 먼저 찾을 export: `useTaskListDetailQuery`

**할 일 상세 / 오른쪽 패널**

- 위치: `/{teamid}/tasklist` 내부 상세
- API: [taskApi.ts](../src/api/taskApi.ts)
- 훅: [useTask.ts](../src/hooks/useTask.ts)
- 먼저 찾을 export: `useTaskDetailQuery`

**할 일 댓글**

- 위치: 오른쪽 패널 댓글
- API: [commentApi.ts](../src/api/commentApi.ts)
- 훅: [useTask.ts](../src/hooks/useTask.ts)
- 먼저 찾을 export:
  - `useTaskCommentsQuery`
  - `useCreateTaskCommentMutation`
  - `useUpdateTaskCommentMutation`
  - `useDeleteTaskCommentMutation`
- 같이 보면 좋은 refetch helper: `refetchTaskCommentQueries`

**반복 일정**

- 라우트: `/{teamid}/tasklist`
- API: [taskApi.ts](../src/api/taskApi.ts)
- 훅: [useRecurring.ts](../src/hooks/useRecurring.ts)
- 먼저 찾을 export:
  - `useCreateRecurringMutation`
  - `useUpdateRecurringMutation`
  - `useDeleteRecurringMutation`
- 같이 보면 좋은 refetch helper: `refetchRecurringQueries`

---

### 게시글

**게시글 목록**

- 라우트: `/boards`
- API: [articleApi.ts](../src/api/articleApi.ts)
- 훅: [useArticle.ts](../src/hooks/useArticle.ts)
- 먼저 찾을 export: `useArticleListQuery`

**게시글 상세**

- 라우트: `/boards/[articleId]`
- API: [articleApi.ts](../src/api/articleApi.ts)
- 훅: [useArticle.ts](../src/hooks/useArticle.ts)
- 먼저 찾을 export: `useArticleDetailQuery`

**게시글 작성 / 수정 / 삭제 / 좋아요**

- 라우트: `/boards`, `/boards/[articleId]`
- API: [articleApi.ts](../src/api/articleApi.ts)
- 훅: [useArticle.ts](../src/hooks/useArticle.ts)
- 먼저 찾을 export:
  - `useCreateArticleMutation`
  - `useUpdateArticleMutation`
  - `useDeleteArticleMutation`
  - `useLikeArticleMutation`
  - `useUnlikeArticleMutation`
- 같이 보면 좋은 refetch helper: `refetchArticleListQueries`, `refetchArticleQueries`

**게시글 댓글**

- 라우트: `/boards/[articleId]`
- API: [commentApi.ts](../src/api/commentApi.ts)
- 훅: [useArticleComment.ts](../src/hooks/useArticleComment.ts)
- 먼저 찾을 export:
  - `useArticleCommentsQuery`
  - `useCreateArticleCommentMutation`
  - `useUpdateArticleCommentMutation`
  - `useDeleteArticleCommentMutation`
- 같이 보면 좋은 refetch helper: `refetchArticleCommentQueries`

---

## 2. 오른쪽 패널에서 댓글 API 붙일 때

이 부분은 많이 물어볼 수 있어서 따로 적어둘게요.

### 상황

오른쪽 패널은 할 일 상세 UI입니다.  
즉 여기 댓글은 **게시글 댓글이 아니라 할 일 댓글**입니다.

그래서 찾아가야 하는 파일은 아래입니다.

### API 파일

[commentApi.ts](../src/api/commentApi.ts)

여기서 할 일 댓글 관련 함수:

- `getTaskComments`
- `createTaskComment`
- `updateTaskComment`
- `deleteTaskComment`

### hook 파일

[useTask.ts](../src/hooks/useTask.ts)

여기서 바로 쓰는 훅:

- `useTaskCommentsQuery`
- `useCreateTaskCommentMutation`
- `useUpdateTaskCommentMutation`
- `useDeleteTaskCommentMutation`

### 예시

댓글 목록 조회:

```ts
const taskCommentsQuery = useTaskCommentsQuery({
  teamId,
  taskId,
});
```

댓글 생성:

```ts
const createTaskCommentMutation = useCreateTaskCommentMutation();

createTaskCommentMutation.mutate({
  teamId,
  taskId,
  body: {
    content: commentText,
  },
});
```

즉, 오른쪽 패널 댓글은:

- API는 `commentApi.ts`
- hook은 `useTask.ts`

를 보면 됩니다.

---

## 3. 게시글 상세에서 댓글 API 붙일 때

이건 이름이 비슷해서 헷갈릴 수 있어요.

게시글 상세 댓글은 **할 일 댓글이 아니라 게시글 댓글**입니다.

### API 파일

[commentApi.ts](../src/api/commentApi.ts)

여기서 게시글 댓글 관련 함수:

- `getArticleComments`
- `createArticleComment`
- `updateArticleComment`
- `deleteArticleComment`

### hook 파일

[useArticleComment.ts](../src/hooks/useArticleComment.ts)

여기서 바로 쓰는 훅:

- `useArticleCommentsQuery`
- `useCreateArticleCommentMutation`
- `useUpdateArticleCommentMutation`
- `useDeleteArticleCommentMutation`

### 예시

```ts
const articleCommentsQuery = useArticleCommentsQuery({
  teamId,
  articleId,
});
```

즉:

- 할 일 상세 댓글이면 `useTask.ts`
- 게시글 댓글이면 `useArticleComment.ts`

입니다.

---

## 4. 게시글 기능 붙일 때

게시글 관련 기능은 대부분 아래 두 파일만 보면 됩니다.

### API 파일

[articleApi.ts](../src/api/articleApi.ts)

들어 있는 함수:

- `getArticleList`
- `getArticleDetail`
- `createArticle`
- `updateArticle`
- `deleteArticle`
- `likeArticle`
- `unlikeArticle`

### hook 파일

[useArticle.ts](../src/hooks/useArticle.ts)

들어 있는 훅:

- `useArticleListQuery`
- `useArticleDetailQuery`
- `useCreateArticleMutation`
- `useUpdateArticleMutation`
- `useDeleteArticleMutation`
- `useLikeArticleMutation`
- `useUnlikeArticleMutation`

### 언제 어떤 걸 쓰는가

| 하고 싶은 일       | 사용할 hook                |
| ------------------ | -------------------------- |
| 게시글 목록 조회   | `useArticleListQuery`      |
| 게시글 상세 조회   | `useArticleDetailQuery`    |
| 게시글 작성        | `useCreateArticleMutation` |
| 게시글 수정        | `useUpdateArticleMutation` |
| 게시글 삭제        | `useDeleteArticleMutation` |
| 게시글 좋아요      | `useLikeArticleMutation`   |
| 게시글 좋아요 취소 | `useUnlikeArticleMutation` |

---

## 5. 팀 / 오늘 할 일 기능 붙일 때

팀 메인 화면이나 날짜별 오늘 할 일은 아래를 보면 됩니다.

### API 파일

[groupApi.ts](../src/api/groupApi.ts)

함수:

- `getTeamDetail`
- `getTeamTasksByDate`

### hook 파일

[useTeam.ts](../src/hooks/useTeam.ts)

훅:

- `useTeamDetailQuery`
- `useTeamTasksByDateQuery`

---

## 6. 마이 히스토리 / 마이페이지 기능 붙일 때

### 내 정보나 프로필 수정

- API: [userApi.ts](../src/api/userApi.ts)
- hook: [useUser.ts](../src/hooks/useUser.ts)

자주 쓰는 것:

- `useMeQuery`
- `useMyGroupsQuery`
- `useMyMembershipsQuery`

### 완료한 할 일 이력

- API: [userApi.ts](../src/api/userApi.ts)
- hook: [useUser.ts](../src/hooks/useUser.ts)

자주 쓰는 것:

- `useCompletedTasksQuery`

### 이미지 업로드

- API: [imageApi.ts](../src/api/imageApi.ts)
- hook: [useImage.ts](../src/hooks/useImage.ts)

자주 쓰는 것:

- `useUploadImageMutation`

---

## 7. 새 기능 붙이기 전에 보는 순서

만약 지금 내가 붙이려는 기능이 어느 파일인지 애매하면,
아래 순서로 보면 거의 다 찾을 수 있습니다.

### 1단계

이 기능이 어떤 화면에 붙는지 먼저 생각합니다.

예:

- 오른쪽 패널
- 게시글 상세
- 마이 히스토리
- 팀 메인

### 2단계

이 문서에서 같은 화면 / 기능 이름을 찾습니다.

### 3단계

표에 적힌 API 파일과 hook 파일을 엽니다.

### 4단계

hook 안의 export 이름을 그대로 사용합니다.

즉, 지금 문서는

> “파일 이름이 기억 안 날 때 바로 찾는 지도”

라고 생각하면 됩니다.

테스트입니다!
