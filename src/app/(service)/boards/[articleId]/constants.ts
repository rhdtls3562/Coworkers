/** 게시글 상세 페이지에서 사용하는 상수 정의 파일입니다. */

export const BOARD_DETAIL_MENU = {
  EDIT: '수정하기',
  DELETE: '삭제하기',
} as const;

export const BOARD_DETAIL_DROPDOWN_ITEMS = [
  { label: BOARD_DETAIL_MENU.EDIT },
  { label: BOARD_DETAIL_MENU.DELETE },
];

export { TEAM_ID } from '@/app/(service)/boards/constants';
export { BOARD_URL_QUERY_FLAG_ENABLED as BOARD_DETAIL_EDIT_MODE_QUERY_VALUE } from '@/app/(service)/boards/constants';

export const MOVE_TO_FRONT = -1;
export const MOVE_TO_BACK = 1;

export const BOARD_DETAIL_FALLBACK_BOARD_LOAD_FAILED =
  '게시글 데이터를 불러오지 못했습니다.';

export const BOARD_DETAIL_FALLBACK_USER_PROFILE_LOAD_FAILED =
  '회원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';

export const BOARD_DETAIL_FALLBACK_EDIT_NOT_OWNER =
  '게시글은 작성자 본인만 수정할 수 있습니다.';
