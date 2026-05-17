/**
 * 프로필/팀 이미지 업로드용 래퍼 컴포넌트입니다.
 */
'use client';

import { ImgAddButtonProps } from '@/components/common/adduserimg/types';
import ImageUploadField from '@/components/common/form/components/ImageUploadField';

export default function AddUserImg({
  cropShape,
  src,
  onChangeFile,
}: ImgAddButtonProps) {
  return (
    <ImageUploadField
      variant="profile"
      cropShape={cropShape}
      src={src}
      previewAlt="유저 프로필 이미지"
      buttonAriaLabel="프로필 이미지 업로드"
      onChangeFile={onChangeFile}
    />
  );
}
