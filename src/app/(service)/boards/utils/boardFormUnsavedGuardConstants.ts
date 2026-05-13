/**
 * 게시글 작성·수정 폼 미저장 안내 토스트 문구와 표시 시간 상수입니다.
 */

export type BoardFormUnsavedIntent = 'create' | 'edit';

export const BOARD_FORM_UNSAVED_TOAST_DURATION = 3000;

export const BOARD_FORM_UNSAVED_TOAST_COPY: Record<
  BoardFormUnsavedIntent,
  { discardLabel: string; message: string }
> = {
  create: {
    message: '아직 게시글을 작성하지 않았어요!',
    discardLabel: '작성 취소',
  },
  edit: {
    message: '저장하지 않은 변경사항이 있어요!',
    discardLabel: '변경사항 취소',
  },
};
