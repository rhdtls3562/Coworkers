<div align="center">

<!-- 🖼️ 서비스 로고 이미지 (추후 추가) -->
<img src="./src/assets/logos/img_logo_full_large.svg" alt="Coworkers Logo" width="180" />

### 팀 협업 플랫폼 & 채용/홍보

함께 만들어가는 To do list, 할 일 관리, 채용/홍보 서비스

<br>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br>

<!-- 🖼️ 서비스 대표 썸네일 (추후 추가) -->
<!-- <img src="./docs/images/thumbnail.png" alt="Coworkers Thumbnail" width="100%" /> -->

[🚀 서비스 바로가기](https://coworkers-blond.vercel.app) &nbsp;|&nbsp; [📋 Swagger API](https://fe-project-cowokers.vercel.app/docs/#/) &nbsp;|&nbsp; [🎨 Figma 디자인](https://www.figma.com/design/d5ogtLVSv1m7e8kx1Lfamy)

</div>

<br>

---

## 📌 목차

- [👥 팀 소개](#-팀-소개)
- [💡 서비스 소개](#-서비스-소개)
- [🖥️ 페이지 소개](#️-페이지-소개)
- [✨ 주요 기능](#-주요-기능)
- [🛠 기술 스택](#-기술-스택)
- [📁 폴더 구조](#-폴더-구조)
- [🚀 시작하기](#-시작하기)
- [📝 커밋 컨벤션](#-커밋-컨벤션)

<br>

---

## 👥 팀 소개

<div align="center">

> **Part4 3팀** &nbsp;|&nbsp; 함께 성장하는 프론트엔드 개발팀

<br>

<!-- 🖼️ 팀 단체 사진 (추후 추가) -->
<!-- <img src="./docs/images/team.png" alt="Team Photo" width="600" /> -->

<br>

| <img width="80" src="https://github.com/rhdtls3562.png" /> | <img width="80" src="https://github.com/ziy1027.png" /> | <img width="80" src="https://github.com/ino0o0o0.png" /> | <img width="80" src="https://github.com/qorwhddls134.png" /> |
|:---:|:---:|:---:|:---:|
| **권새롬** | **김송현** | **강인영** | **백종인** |
| 팀장 | 팀원 | 팀원 | 팀원 |
| 랜딩/로그인/마이히스토리 | 계정설정/팀페이지 | 리스트페이지 | 채용홍보페이지 |
| [@rhdtls3562](https://github.com/rhdtls3562) | [@ziy1027](https://github.com/ziy1027) | [@ino0o0o0](https://github.com/ino0o0o0) | [@qorwhddls134](https://github.com/qorwhddls134) |

<!-- 팀원 GitHub 아이디로 위 이미지 src와 링크를 교체하세요 -->
<!-- 예: src="https://github.com/username.png" -->

</div>

<br>

<div align="center">

### 💬 팀 한마디

> _"각자의 강점을 살려 피땀눈물로 함께 만들어낸 프로젝트입니다."_

</div>

<br>

---

## 💡 서비스 소개

**Coworkers**는 팀 기반의 To do list 작성, 할 일 관리, 채용/홍보 게시판 기능을 제공하는 웹 서비스입니다.

React Query를 활용한 효율적인 서버 상태 관리와 직관적인 UI/UX로 팀원 간의 소통과 협업을 도와줍니다.

<br>

<div align="center">

<!-- 🖼️ 서비스 소개 GIF 또는 이미지 (추후 추가) -->
<!-- <img src="./docs/images/overview.gif" alt="Service Overview" width="80%" /> -->

</div>

<br>

---

## 🖥️ 페이지 소개

### 🏠 랜딩 페이지 `/`

<div align="center">

<!-- 🖼️ 랜딩 페이지 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/landing.png" alt="Landing Page" width="80%" /> -->

</div>

서비스 진입점으로, 로그인 여부에 따라 팀 페이지 또는 로그인 페이지로 이동합니다.

<br>

---

### 🔐 로그인 / 회원가입 `/login` `/signup`

<div align="center">

<!-- 🖼️ 로그인·회원가입 페이지 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/auth.png" alt="Auth Pages" width="80%" /> -->

</div>

- 이메일 기반 로그인 / 회원가입
- 카카오 소셜 로그인 지원
- 실시간 유효성 검사 및 에러 메시지 표시

<br>

---

### 🏢 팀 페이지 `/{teamid}`

<div align="center">

<!-- 🖼️ 팀 페이지 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/team.png" alt="Team Page" width="80%" /> -->

</div>

- 팀 생성 / 참여 / 수정 / 삭제
- 멤버 초대 링크 복사
- 오늘의 진행상황 리포트 (관리자 전용)

<br>

---

### ✅ 할 일 리스트 `/{teamid}/tasklist`

<div align="center">

<!-- 🖼️ 할 일 리스트 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/tasklist.png" alt="Task List Page" width="80%" /> -->

</div>

- 할 일 목록 추가 / 수정 / 삭제
- 할 일 체크로 즉시 완료 처리
- 할 일 상세 — 댓글 생성 / 수정 / 삭제

<br>

---

### 📋 자유게시판 `/boards`

<div align="center">

<!-- 🖼️ 자유게시판 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/boards.png" alt="Boards Page" width="80%" /> -->

</div>

- 게시글 생성 / 수정 / 삭제
- 좋아요 기반 베스트 게시글
- 제목 기반 키워드 검색

<br>

---

### 🕐 마이 히스토리 `/myhistory`

<div align="center">

<!-- 🖼️ 마이 히스토리 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/myhistory.png" alt="My History Page" width="80%" /> -->

</div>

일자별로 내가 완료한 할 일 목록을 한눈에 확인할 수 있습니다.

<br>

---

### ⚙️ 계정 설정 `/mypage`

<div align="center">

<!-- 🖼️ 계정 설정 스크린샷 (추후 추가) -->
<!-- <img src="./docs/images/pages/mypage.png" alt="My Page" width="80%" /> -->

</div>

- 프로필 이미지 / 이름 변경
- 비밀번호 변경 / 회원 탈퇴

<br>

---

## ✨ 주요 기능

| 기능 | 설명 |
|:---:|---|
| 🔐 **인증** | 이메일 로그인·회원가입, 카카오 소셜 로그인, 비밀번호 재설정 |
| 🏢 **팀 관리** | 팀 생성·참여·수정·삭제, 멤버 초대 링크, 진행상황 리포트 |
| ✅ **할 일 관리** | 목록 CRUD, 체크 완료, 댓글 기능 |
| 📋 **자유게시판** | 게시글 CRUD, 좋아요 베스트, 키워드 검색 |
| 🕐 **마이 히스토리** | 일자별 완료 할 일 조회 |
| ⚙️ **계정 설정** | 프로필 수정, 비밀번호 변경, 회원 탈퇴 |

<br>

---

## 🛠 기술 스택

<div align="center">

### Frontend

| 분류 | 기술 |
|:---:|:---:|
| Framework | ![Next.js](https://img.shields.io/badge/Next.js-000?style=flat-square&logo=nextdotjs&logoColor=white) |
| Language | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| Server State | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) |
| Form | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) + ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) |
| Deploy | ![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white) |
| Storage | ![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=flat-square&logo=amazons3&logoColor=white) |

### 협업 도구

| 분류 | 도구 |
|:---:|:---:|
| 버전 관리 | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) |
| 코드 품질 | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black) ![Husky](https://img.shields.io/badge/Husky-000?style=flat-square) |
| 디자인 | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white) |

</div>

<br>

---

## 📁 폴더 구조

```
src/
├─ api/                   # fetch 기반 API 함수 (auth, group, task, comment, board)
├─ app/                   # Next.js App Router
│  ├─ (landing)/          # 랜딩 페이지 "/"
│  └─ (service)/          # 서비스 페이지 그룹
│     ├─ login/           # 로그인
│     ├─ signup/          # 회원가입
│     ├─ addteam/         # 팀 생성
│     ├─ jointeam/        # 팀 참여
│     ├─ myhistory/       # 마이 히스토리
│     ├─ mypage/          # 계정 설정
│     ├─ boards/          # 자유게시판
│     └─ groups/[groupId] # 팀 & 할 일 관련 페이지
├─ assets/                # 아이콘, 이미지, 로고
├─ components/
│  ├─ common/             # 재사용 공통 UI 컴포넌트
│  └─ layout/             # 헤더, 사이드바 등 레이아웃
├─ constants/             # 전역 상수
├─ contexts/              # 전역 클라이언트 상태
├─ hooks/                 # 커스텀 훅
├─ styles/                # 전역 스타일 / CSS 변수
├─ types/                 # 도메인별 TypeScript 타입
└─ utils/                 # 공통 유틸 함수
```

<br>

---

## 🚀 시작하기

### 요구 사항

- Node.js 18 이상
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/part4-3team/Coworkers.git
cd Coworkers

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

> 로컬 실행 주소: [http://localhost:3000](http://localhost:3000)

### 환경변수 설정

루트 경로에 `.env.local` 파일을 생성하세요.

```env
# 예시 (실제 값은 팀 내부 공유)
NEXT_PUBLIC_API_BASE_URL=https://fe-project-cowokers.vercel.app
```

> ⚠️ `.env.local`은 Git에 포함되지 않습니다. 보안 정보는 절대 커밋하지 마세요.

### 빌드 및 린트 확인

```bash
npm run lint
npm run build
```

> PR 전 위 두 명령어를 반드시 확인해주세요.

<br>

---

## 📝 커밋 컨벤션

Gitmoji를 활용한 커밋 메시지를 사용합니다.

| 이모지 | 타입 | 설명 |
|:---:|:---:|---|
| 🎉 | `Init` | 프로젝트 생성 |
| ✨ | `Feat` | 새로운 기능 / 페이지 추가 |
| 🐛 | `Fix` | 버그 수정 |
| ♻️ | `Refactor` | 코드 리팩토링 |
| 🔧 | `Chore` | 설정, 빌드, 패키지, 에셋 추가 |
| 🎨 | `Style` | 스타일 / 포맷팅 변경 |
| 📝 | `Docs` | 문서 수정 |
| 🚚 | `Rename` | 파일 / 디렉토리 이동 또는 이름 변경 |
| 🔥 | `Remove` | 코드 / 파일 삭제 |

**작성 예시**
```
✨ Feat: 로그인 페이지 유효성 검사 추가
🐛 Fix: 팀 생성 시 이름 중복 에러 처리
```

<br>

---

<div align="center">

## 🔗 링크

[![배포](https://img.shields.io/badge/🚀_배포_주소-gray?style=for-the-badge)](https://coworkers-blond.vercel.app/)
[![Swagger](https://img.shields.io/badge/Swagger-API_문서-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://fe-project-cowokers.vercel.app/docs/#/)
[![Figma](https://img.shields.io/badge/Figma-디자인_시안-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/d5ogtLVSv1m7e8kx1Lfamy)

<br>
<br>

© 2026 Coworkers · Part4 3팀

</div>
