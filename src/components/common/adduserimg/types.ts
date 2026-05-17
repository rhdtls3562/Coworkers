/** 유저 이미지 추가 버튼 컴포넌트 TypeScript 타입 정의 파일입니다. */

import type { ImageCropShape } from '@/components/common/form/types';

export type ImgAddButtonProps = {
  cropShape?: ImageCropShape;
  src?: string | null;
  onChangeFile?: (file: File | null) => void;
};
