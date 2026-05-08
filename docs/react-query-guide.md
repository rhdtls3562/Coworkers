# React Query 사용 설명서

이 문서는 React Query를 처음 쓰는 팀원도 바로 따라올 수 있게,
지금 프로젝트에서 **어떤 파일을 어디에 쓰는지**를 쉽게 설명한 안내서입니다.

어렵게 생각하지 말고, 먼저 이 한 줄만 기억하면 됩니다.

> **화면에서는 보통 `src/hooks`만 쓰면 되고, 캐시를 다시 받아와야 할 때만 `queryKeys`를 같이 보면 됩니다.**

페이지 기능별로 “어느 API / 훅을 보면 되는지”를 빠르게 찾고 싶다면
[page-feature-navigation.md](./page-feature-navigation.md)를 같이 보면 됩니다.

---

## 1. 전체 구조를 먼저 아주 짧게 보면

```text
src/
├─ api/
│  ├─ *Api.ts
│  ├─ queryKeys/
│  ├─ queryOptions/
│  └─ ...
└─ hooks/
   ├─ useArticle.ts
   ├─ useArticleComment.ts
   ├─ useTask.ts
   └─ ...
```

이걸 아주 쉽게 풀면:

- `api/*Api.ts`: 서버에 요청 보내는 곳
- `api/queryKeys`: 캐시 이름표 만드는 곳
- `api/queryOptions`: React Query 기본 세팅 모아두는 곳
- `hooks`: 화면에서 진짜 쓰는 곳

---

## 2. 가장 먼저 이해하면 좋은 4가지

React Query 구조는 아래 4개로 나뉩니다.

### 1) API 함수

서버에 진짜 요청을 보내는 함수입니다.

예:

- [articleApi.ts](../src/api/articleApi.ts)
- [commentApi.ts](../src/api/commentApi.ts)

쉽게 말하면:

- `getArticleList()`는 게시글 목록을 가져오고
- `createArticleComment()`는 게시글 댓글을 생성합니다.

여기에는 React Query 코드가 없습니다.  
그냥 fetch만 담당합니다.

---

### 2) query key

React Query가 캐시를 저장할 때 쓰는 이름표입니다.

예:

```ts
queryKeys.article.list(teamId, { page: 1, pageSize: 10 });
queryKeys.article.detail(teamId, articleId);
queryKeys.articleComment.list(teamId, articleId, { limit: 10 });
```

쉽게 말하면:

- “이건 게시글 목록 캐시”
- “이건 게시글 상세 캐시”
- “이건 이 게시글의 댓글 캐시”

를 React Query가 구분할 수 있게 붙이는 이름입니다.

---

### 3) query options

`queryKey`와 `queryFn`을 묶어둔 기본 세팅입니다.

예:

- [articleQueryOptions.ts](../src/api/queryOptions/articleQueryOptions.ts)
- [commentQueryOptions.ts](../src/api/queryOptions/commentQueryOptions.ts)

쉽게 말하면:

- “이 요청은 어떤 key를 쓰고”
- “어떤 API 함수를 호출하고”
- “기본 캐시 시간은 얼마나 주는지”

를 미리 정리해둔 파일입니다.

---

### 4) hook

우리가 화면에서 실제로 사용하는 최종 입구입니다.

예:

- [useArticle.ts](../src/hooks/useArticle.ts)
- [useArticleComment.ts](../src/hooks/useArticleComment.ts)

화면에서는 대부분 이것만 쓰면 됩니다.

예:

```ts
const articleListQuery = useArticleListQuery({
  teamId,
});
```

이 한 줄 안에서 내부적으로:

- `queryKey`도 연결되고
- API 함수도 호출되고
- React Query 옵션도 붙습니다.

---

## 3. 실제로는 어떤 순서로 연결되는가

예를 들어 “게시글 목록 조회”는 아래 순서로 이어집니다.

### 1단계. API 함수

[articleApi.ts](../src/api/articleApi.ts) 안의:

```ts
getArticleList(teamId, params);
```

### 2단계. query key

[article.ts](../src/api/queryKeys/article.ts) 안의:

```ts
queryKeys.article.list(teamId, params);
```

### 3단계. query options

[articleQueryOptions.ts](../src/api/queryOptions/articleQueryOptions.ts) 안의:

```ts
articleQueryOptions.list(teamId, params, options);
```

### 4단계. hook

[useArticle.ts](../src/hooks/useArticle.ts) 안의:

```ts
useArticleListQuery({ teamId, params, options });
```

### 5단계. 화면에서 사용

```ts
const articleListQuery = useArticleListQuery({
  teamId,
});
```

즉, 팀원이 화면에서 볼 때는 **마지막 hook만 알면** 됩니다.

---

## 4. 지금 프로젝트에서는 어떤 이름으로 검색하면 되는가

여기 한 번 헷갈릴 수 있어요.

화면 경로는 `/boards`인데,  
Swagger 기준 이름은 `Article`입니다.

그래서 데이터 계층은 아래처럼 읽으면 됩니다.

| 화면에서 보이는 이름 | 실제 React Query 이름 |
| -------------------- | --------------------- |
| 게시판 / 채용 / 홍보 | `article`             |
| 게시글 댓글          | `articleComment`      |
| 할 일 댓글           | `comment`             |
| 팀                   | `team`                |

즉:

- 라우트는 `/boards`
- query key는 `queryKeys.article`
- hook은 `useArticle...`

이렇게 연결된다고 생각하면 됩니다.

---

## 5. 팀원이 가장 자주 쓰게 될 hook

### 게시글 목록

```ts
const articleListQuery = useArticleListQuery({
  teamId,
});
```

이 hook은 기본적으로 아래 값을 자동으로 넣습니다.

```ts
{
  page: 1,
  pageSize: 10,
  orderBy: 'recent',
}
```

그래서 단순 목록 화면이면 params를 안 줘도 됩니다.

---

### 게시글 상세

```ts
const articleDetailQuery = useArticleDetailQuery({
  teamId,
  articleId,
});
```

---

### 게시글 댓글 목록

```ts
const articleCommentsQuery = useArticleCommentsQuery({
  teamId,
  articleId,
});
```

이 hook은 기본적으로:

```ts
{
  limit: 10,
}
```

을 자동으로 넣어줍니다.

---

### 할 일 댓글 목록

```ts
const taskCommentsQuery = useTaskCommentsQuery({
  teamId,
  taskId,
});
```

---

### 내 정보

```ts
const meQuery = useMeQuery();
```

---

### 내가 속한 팀 목록

```ts
const myGroupsQuery = useMyGroupsQuery();
```

---

## 6. `options`는 언제 쓰는가

기본 hook만 써도 되지만, 화면마다 조금 더 제어하고 싶을 때 `options`를 씁니다.

예:

```ts
const articleDetailQuery = useArticleDetailQuery({
  teamId,
  articleId,
  options: {
    enabled: !!articleId,
  },
});
```

여기서 `enabled`는:

> articleId가 있을 때만 요청 보내기

라는 뜻입니다.

또는 `select`를 써서 응답 일부만 꺼낼 수도 있습니다.

```ts
const articleListQuery = useArticleListQuery({
  teamId,
  options: {
    select: (data) => data,
  },
});
```

즉,

- `params`는 서버에 보낼 값
- `options`는 React Query 동작 설정

이라고 생각하면 됩니다.

---

## 7. `all`, `lists`, `detail`은 뭐고 언제 쓰는가

이 부분이 초반에 제일 헷갈릴 수 있는데,  
생각보다 단순합니다.

### `detail`

상세 1개를 가리킵니다.

```ts
queryKeys.article.detail(teamId, articleId);
```

의미:

> 이 게시글 한 개의 상세 캐시

---

### `list`

목록 1개를 가리킵니다.

```ts
queryKeys.article.list(teamId, {
  page: 1,
  pageSize: 10,
});
```

의미:

> 이 조건으로 조회한 게시글 목록 캐시

---

### `lists`

목록 계열 전체를 가리킵니다.

```ts
queryKeys.article.lists(teamId);
```

의미:

> 이 팀의 게시글 목록 캐시들을 묶어서 가리킴

주로 이런 때 씁니다.

- 게시글 생성 후 목록 새로고침
- 게시글 삭제 후 목록 새로고침

---

### `all`

해당 도메인 전체를 가리킵니다.

```ts
queryKeys.article.all(teamId);
queryKeys.articleComment.all(teamId);
```

의미:

> 이 팀의 게시글 관련 캐시 전체  
> 또는 이 팀의 게시글 댓글 관련 캐시 전체

네가 물어본 `all`은 **추가되어 있습니다.**

예를 들면:

- `queryKeys.article.all(teamId)`
- `queryKeys.articleComment.all(teamId)`
- `queryKeys.comment.all(teamId)`

이렇게 들어가 있어요.

---

### 중간 범위 key

이건 이번에 같이 보강한 포인트입니다.

#### 게시글 댓글

```ts
queryKeys.articleComment.article(teamId, articleId);
```

의미:

> 이 게시글에 달린 댓글 캐시 전체

즉 `list`, `infiniteList`를 한 번에 잡고 싶을 때 편합니다.

#### 할 일 댓글

```ts
queryKeys.comment.task(teamId, taskId);
```

의미:

> 이 할 일에 달린 댓글 캐시 전체

---

## 8. 왜 `commentApi.ts`에 댓글이 두 종류 같이 들어 있는가

현재 [commentApi.ts](../src/api/commentApi.ts)에는 댓글이 두 종류 들어 있습니다.

### 할 일 댓글

- Swagger `Comment`

### 게시글 댓글

- Swagger `ArticleComment`

이걸 지금 굳이 파일 두 개로 나누지 않은 이유는:

- 둘 다 CRUD 패턴이 비슷하고
- 지금 구현량이 아주 크지 않고
- 한 파일에서 비교하며 보는 편이 더 쉽기 때문입니다.

즉 지금은:

- 할 일 댓글도 [commentApi.ts](../src/api/commentApi.ts)
- 게시글 댓글도 [commentApi.ts](../src/api/commentApi.ts)

를 보면 됩니다.

---

## 9. `queryOptions/constants.ts`는 왜 만들었는가

[constants.ts](../src/api/queryOptions/constants.ts)는
여러 query options에서 공통으로 쓰는 기본 캐시 옵션 모음입니다.

예:

- `DETAIL_STALE_TIME`
- `LIST_STALE_TIME`
- `COMMENT_LIST_STALE_TIME`
- `USER_ME_STALE_TIME`

왜 필요하냐면,
매 파일마다 `30초`, `5분` 같은 값을 흩어 쓰면 나중에 수정하기 어렵기 때문입니다.

그래서 지금 기준은

- 상세는 이 정도
- 목록은 이 정도
- 댓글 목록은 이 정도

같은 기본 규칙을 한 곳에 두고 재사용하는 구조입니다.

---

## 10. invalidate는 언제 쓰는가

`invalidateQueries`는

> “이 캐시는 오래됐을 수 있으니 다시 받아와”

라고 React Query에게 알려주는 동작입니다.

예를 들어 게시글 댓글을 수정하면:

- 댓글 목록도 다시 받아와야 하고
- 게시글 상세에 있는 댓글 수 같은 정보도 다시 받아와야 할 수 있습니다.

그래서 현재 훅 내부는 이런 식으로 되어 있습니다.

```ts
queryClient.invalidateQueries({
  queryKey: queryKeys.articleComment.article(teamId, articleId),
});

queryClient.invalidateQueries({
  queryKey: queryKeys.article.detail(teamId, articleId),
});
```

이 의미는:

1. 이 게시글의 댓글 관련 캐시를 다시 받아오고
2. 이 게시글 상세 캐시도 다시 받아온다

입니다.

---

## 11. 지금은 공통 refetch helper도 같이 쓴다

반복해서 같은 `invalidateQueries` 코드를 쓰지 않도록
지금 프로젝트에는 공통 helper 파일도 있습니다.

- [queryRefetch.ts](../src/api/queryRefetch.ts)

이 파일은 이름은 `refetch`지만,
내부 구현은 React Query의 `invalidateQueries`를 사용합니다.

즉 팀원 입장에서는

> “mutation 성공 후 어떤 데이터를 다시 받아와야 하는지”

를 훅마다 새로 쓰지 않고,
이미 만들어둔 helper를 가져다 쓰면 됩니다.

예를 들면:

```ts
await refetchArticleQueries(queryClient, teamId, articleId);
await refetchTaskCommentQueries(queryClient, teamId, taskId);
await refetchUserQueries(queryClient);
```

쉽게 연결하면:

- 사용자 정보가 바뀌면 -> `refetchUserQueries`
- 게시글 상세/좋아요/삭제가 바뀌면 -> `refetchArticleQueries`
- 게시글 댓글이 바뀌면 -> `refetchArticleCommentQueries`
- 할 일 댓글이 바뀌면 -> `refetchTaskCommentQueries`
- 반복 일정이 바뀌면 -> `refetchRecurringQueries`

즉 지금은

- `queryKeys`는 캐시 이름을 만들고
- `queryRefetch.ts`는 “무엇을 다시 받아올지”를 묶고
- `hooks`는 그 helper를 호출하는 구조

라고 생각하면 됩니다.

---

## 12. 왜 화면에서는 hook만 쓰면 편한가

예를 들어 댓글 생성 버튼을 눌렀다고 해볼게요.

화면에서 우리가 할 일은 보통 이것뿐입니다.

```ts
const createArticleCommentMutation = useCreateArticleCommentMutation();
```

그리고 실제 클릭 시:

```ts
createArticleCommentMutation.mutate({
  teamId,
  articleId,
  body: {
    content: commentText,
  },
});
```

그러면 hook 내부에서:

- API 요청 보내고
- 성공하면
- 관련 query invalidate까지 해줍니다.

그래서 팀원 입장에서는

> “mutation 성공 후 어떤 목록을 다시 받아야 하지?”

를 매번 다시 고민하지 않아도 됩니다.

---

## 13. 새 API를 붙일 때 순서

새 기능을 붙일 때는 아래 순서대로 가면 됩니다.

### 1단계. Swagger 먼저 보기

예:

- `Article`
- `ArticleComment`
- `Comment`
- `Group`

여기서 태그 이름을 먼저 봅니다.

---

### 2단계. API 함수 만들기

예:

- 게시글이면 [articleApi.ts](../src/api/articleApi.ts)
- 댓글이면 [commentApi.ts](../src/api/commentApi.ts)

여기는 fetch만 만듭니다.

---

### 3단계. query key 만들기

예:

- [article.ts](../src/api/queryKeys/article.ts)
- [team.ts](../src/api/queryKeys/team.ts)

이때 같이 판단합니다.

- `detail` 필요한가?
- `list` 필요한가?
- `all` 필요한가?
- 중간 범위 key 필요한가?

---

### 4단계. query options 만들기

예:

- [articleQueryOptions.ts](../src/api/queryOptions/articleQueryOptions.ts)
- [commentQueryOptions.ts](../src/api/queryOptions/commentQueryOptions.ts)

---

### 5단계. hook 만들기

예:

- [useArticle.ts](../src/hooks/useArticle.ts)
- [useArticleComment.ts](../src/hooks/useArticleComment.ts)

mutation이 있다면 이 단계에서 같이 확인합니다.

- 기존 `queryRefetch.ts` helper를 재사용할 수 있는가?
- 없다면 새 도메인용 refetch helper를 추가해야 하는가?

즉 새 기능을 만들 때는 이제

1. API 함수
2. query key
3. query options
4. hook
5. mutation 후 refetch 범위

까지 같이 보는 흐름입니다.

여기서 화면에서 바로 쓸 수 있는 형태로 감쌉니다.

---

## 13. 어디까지 공통 훅으로 빼야 하는가

### `src/hooks`에 두는 것

여러 화면에서 재사용될 서버 상태

예:

- 게시글 목록
- 게시글 상세
- 게시글 댓글
- 내 정보
- 팀 상세

### 각 페이지 폴더 `hooks/`에 두는 것

화면 전용 UI 상태

예:

- 모달 열림/닫힘
- 탭 선택 상태
- 드래그 상태
- 임시 입력값

즉,

- 서버에서 받아오는 값 = 공통 훅
- 화면에서만 쓰는 UI 상태 = 라우트 훅

이라고 보면 됩니다.

---

## 14. 초보 기준으로 제일 쉽게 기억하는 방법

처음엔 정말 이것만 기억해도 괜찮습니다.

### 조회하고 싶다

→ `src/hooks`에서 `useSomethingQuery`를 찾는다

### 생성/수정/삭제하고 싶다

→ `src/hooks`에서 `useSomethingMutation`을 찾는다

### 캐시를 다시 받아와야 할 것 같다

→ `queryKeys`를 본다

### 새 API를 붙여야 한다

→ `api 함수 -> queryKeys -> queryOptions -> hook` 순서로 만든다

---

## 15. 마지막 체크리스트

작업 전에 아래만 보면 실수가 많이 줄어듭니다.

- Swagger 태그 이름으로 도메인 이름을 잡았는가?
- 화면에서는 hook만 써도 되는 구조인가?
- `all`, `lists`, 중간 범위 key가 필요한지 생각했는가?
- mutation 후 어떤 캐시를 invalidate해야 하는지 정했는가?
- 팀원이 다음에 봐도 이름만 검색해서 찾을 수 있는가?

이 기준만 지키면 React Query가 훨씬 덜 무섭고,  
팀원끼리 코드를 이어붙일 때도 훨씬 편해집니다.
