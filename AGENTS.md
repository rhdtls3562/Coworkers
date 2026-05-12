<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Coworkers Project Guide

## 핵심 원칙

- 답변과 코드 설명은 한국어로 작성한다.
- JavaScript/TypeScript 코드는 ES6+ 기준으로 작성한다.
- 충분한 근거 없이 단정하지 않는다. 확실하지 않으면 "알 수 없음" 또는 "확실하지 않음"이라고 쓴다.
- 기술 스택에 없는 라이브러리나 도구는 임의로 추가하지 않는다.
- Next.js 관련 코드를 작성하기 전에는 설치된 문서(`node_modules/next/dist/docs/`)를 확인한다.
- API는 백엔드 구현 대상이 아니라 Swagger 외부 API를 fetch로 호출하는 대상으로 취급한다.

## 기술 스택

- Next.js
- TypeScript
- Tailwind
- fetch
- Vercel
- ESLint, Prettier, Husky
- TanStack Query
- Zod
- React Hook Form
- react-datepicker
- react-circular-progressbar
- @ramonak/react-progress-bar
- clsx, tailwind-merge
- Gitmoji

## 참고 링크

- Swagger API: https://fe-project-cowokers.vercel.app/docs/#/

## 컴포넌트 규칙

- 공통으로 2곳 이상 쓰일 UI만 `src/components/common`에 둔다.
- 페이지 전체 레이아웃 요소는 `src/components/layout`에 둔다.
- 페이지 전용 컴포넌트는 해당 `app` 라우트 폴더 안에 두는 것을 기본으로 한다.
- 분리할 파일이 거의 없는 단순 화면만 `page.tsx` 안에서 단순화할 수 있다.
- 라우트 전용 폴더는 기본적으로 `components/`, `constants.ts`, `types.ts` 구조를 사용한다.
- `app` 라우트 폴더에는 배럴용 `index.ts`를 만들지 않는다.
- 훅이 필요한 경우에만 `hooks/`를 추가한다.
- 해당 폴더의 실제 UI 컴포넌트는 대표 컴포넌트까지 모두 `components/` 안에 둔다.
- 날짜 선택 UI는 `react-datepicker`를 직접 쓰지 않고 공용 `DatePicker` 컴포넌트로 감싸서 사용한다.
- `next/image` 사용 시 Next.js 16 기준으로 deprecated 된 `priority` prop은 사용하지 않는다.
- 이미지 우선 로딩이 필요할 경우 `preload`, `loading="eager"`, `fetchPriority="high"` 중 상황에 맞는 한 가지 방식을 우선 검토한다.
- 작은 로고, 아이콘, 일반 UI 이미지는 불필요하게 high priority 로딩을 지정하지 않는다.

## 코드 컨벤션

- 절대경로 별칭 `@/`를 사용하고 상대경로 import는 사용하지 않는다.
- 예외: 프레임워크나 외부 CSS가 요구하는 경우만 허용한다.
- 조건부 className은 `@/utils/cn`의 `cn` 유틸을 사용한다.
- TypeScript 타입은 기본적으로 `interface` 대신 `type`을 사용한다.
- 이벤트 핸들러는 `handle + 동사`, prop 이벤트는 `on + 동사`로 작성한다.
- Boolean 변수는 `is`, `has` 접두사를 사용한다.
- 상수는 `UPPER_SNAKE_CASE`를 사용한다.
- 컴포넌트나 모듈 파일이 130줄을 초과하면 역할 단위로 파일을 분리한다.
- import 구문과 타입 선언은 줄 수 계산에서 제외한다.

## 스타일 규칙

- 기본 스타일링은 Tailwind를 사용한다.
- 인라인 스타일과 다른 CSS-in-JS 혼용은 지양한다.
- 기본 본문 폰트는 Pretendard를 사용한다.
- 로고 텍스트는 폰트가 아니라 SVG 에셋으로 사용한다.
- Tailwind 임의값 `[]` 사용은 지양하고 기본 scale을 우선한다.
- 소수점 scale 값은 사용할 수 있다. 예: `px-3.75`, `w-67.5`
- 임의값 지양은 무조건 토큰으로 분리하라는 의미가 아니다.
- 모바일 퍼스트 기준으로 작성한다.

## 네이밍 규칙

- 일반 디렉토리명은 camelCase를 사용한다. 예: `pageHeader`, `rightPanel`
- App Router 라우트 세그먼트: 임의 변경 금지, 변경이 필요하면 팀원과 먼저 상의
- 컴포넌트 `.tsx`: PascalCase
- App Router 특수 파일: `page.tsx`, `layout.tsx`, `route.ts`
- 훅, 유틸, API, 일반 모듈: camelCase
- 상수 파일: UPPER_SNAKE_CASE
- 아이콘 파일명: `ic_` + snake_case
- `src/assets/index.ts`의 아이콘 export 이름: camelCase
- 이미지: `img_` + snake_case
- 로고: `img_logo_` + snake_case

## 접근성 및 주석

- 의미 있는 이미지는 구체적인 `alt`를 작성한다.
- 장식 이미지는 `alt=""`를 사용한다.
- 시맨틱 태그와 헤딩 계층을 지킨다.
- 파일 상단 설명은 필요한 경우 TSDoc(`/** ... */`)으로 작성한다.
- 작업 예정 내용은 `// TODO: 내용` 형식을 사용한다.
- 주석에는 이모지를 넣지 않는다.

## 커밋 컨벤션

예시: `🔧 Chore: eslint&prettier 설정 추가`

- `🎉 Init`: 프로젝트 생성
- `✨ Feat`: 기능/페이지 추가
- `🐛 Fix`: 버그 수정
- `♻️ Refactor`: 리팩토링
- `🔧 Chore`: 설정, 빌드, 패키지, 에셋 추가
- `🎨 Style`: 스타일/포맷팅
- `📝 Docs`: 문서 수정
- `🚚 Rename`: 파일/디렉토리 이동 또는 이름 변경
- `🔥 Remove`: 코드/파일 삭제

커밋 본문은 제목과 빈 행으로 분리하고, 한 줄 72자 이내로 한글 작성한다.
