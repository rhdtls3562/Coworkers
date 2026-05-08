/**
 * 프로필/팀 이미지 업로드용 래퍼 컴포넌트입니다.
 */
'use client';

import ImageUploadField from '@/components/common/form/components/ImageUploadField';

import { ImgAddButtonProps } from './types';

export default function AddUserImg({ src, onChangeFile }: ImgAddButtonProps) {
  return (
    <ImageUploadField
      variant="profile"
      src={src}
      previewAlt="유저 프로필 이미지"
      buttonAriaLabel="프로필 이미지 업로드"
      onChangeFile={onChangeFile}
    />
  );
}
