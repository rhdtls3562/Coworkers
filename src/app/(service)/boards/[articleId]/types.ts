/** 게시글 상세 페이지 TypeScript 타입 정의 파일입니다. */

import type { Post } from '@/app/(service)/boards/types';
import { RoleProps } from '@/app/types';

export type BoardDetailProps = {
  boardDetail: Post;
};

export type BoardDetailParams = {
  articleId: string;
};

type Group = {
  id: number;
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string | null;
  name: string;
};

/** 멤버십(그룹 가입 정보) 타입 */
type Membership = {
  group: Group;
  role: RoleProps;
  userImage: string | null;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
};

/** 최종 프로필 조회 응답 타입 */
export type UserProfileResponse = {
  teamId: string;
  image: string | null; // 프로필 이미지
  nickname: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  id: number;
  memberships: Membership[];
};

type CommentWriter = {
  image: string | null;
  nickname: string;
  id: number;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  writer: CommentWriter;
};

export type BoardDetailCommentsProps = {
  commentCount: number;
  userProfile: UserProfileResponse | null;
};
