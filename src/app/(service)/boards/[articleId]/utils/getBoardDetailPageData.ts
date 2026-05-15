/**
 * 게시글 상세 페이지에 필요한 게시글 본문과 사용자 프로필을 병렬로 조회하는 유틸입니다.
 */

import { teamEndpoint } from '@/api/apiClient';
import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import type { UserProfileResponse } from '@/app/(service)/boards/[articleId]/types';
import { fetchWithAuth } from '@/app/(service)/boards/[articleId]/utils/fetchWithAuth';
import type { Post } from '@/app/(service)/boards/types';

type GetBoardDetailPageDataParams = {
  articleId: string;
};

export async function getBoardDetailPageData({
  articleId,
}: GetBoardDetailPageDataParams) {
  if (!TEAM_ID) {
    return {
      boardDetail: null,
      errorMessage: '팀 설정이 누락되어 게시글을 불러올 수 없습니다.',
      userProfile: null,
    } as const;
  }

  try {
    const [boardDetailData, userProfileData] = await Promise.all([
      fetchWithAuth(teamEndpoint(`/articles/${articleId}`, TEAM_ID)),
      fetchWithAuth(teamEndpoint('/user', TEAM_ID))
        .then((data) => data as UserProfileResponse)
        .catch(() => null),
    ]);

    return {
      boardDetail: boardDetailData as Post,
      errorMessage: null,
      userProfile: userProfileData,
    } as const;
  } catch {
    return {
      boardDetail: null,
      errorMessage: '게시글 데이터를 불러오지 못했습니다.',
      userProfile: null,
    } as const;
  }
}
