'use client';

import { useCallback, useMemo, useState } from 'react';

import { isRequiredTextValid } from '@/app/(service)/boards/utils/boardFormUtils';

type BoardFormData = {
  content: string;
  image: string | null;
  title: string;
};

type UseBoardFormFieldsParams = {
  initialFormData?: BoardFormData;
  requiresChange?: boolean;
};

export default function useBoardFormFields({
  initialFormData,
  requiresChange = false,
}: UseBoardFormFieldsParams = {}) {
  const defaultFormData = useMemo(
    () => ({
      title: initialFormData?.title ?? '',
      content: initialFormData?.content ?? '',
      image: initialFormData?.image ?? null,
    }),
    [initialFormData?.content, initialFormData?.image, initialFormData?.title],
  );
  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTitleTouched, setIsTitleTouched] = useState(false);
  const [isContentTouched, setIsContentTouched] = useState(false);

  const isTitleValid = isRequiredTextValid(formData.title);
  const isContentValid = isRequiredTextValid(formData.content);
  const hasTitleChanged = formData.title !== defaultFormData.title;
  const hasContentChanged = formData.content !== defaultFormData.content;
  const hasImageChanged =
    imageFile !== null || formData.image !== defaultFormData.image;
  const hasFormChanged =
    hasTitleChanged || hasContentChanged || hasImageChanged;
  const shouldShowTitleError = !isTitleValid && (isSubmitted || isTitleTouched);
  const shouldShowContentError =
    !isContentValid && (isSubmitted || isContentTouched);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  const handleTitleBlur = () => {
    setIsTitleTouched(true);
  };
  const handleContentBlur = () => {
    setIsContentTouched(true);
  };
  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  const handleDiscardChanges = useCallback(() => {
    setFormData(defaultFormData);
    setImageFile(null);
    setIsSubmitted(false);
    setIsTitleTouched(false);
    setIsContentTouched(false);
  }, [defaultFormData]);

  return {
    formData,
    imageFile,
    isTitleValid,
    isContentValid,
    hasFormChanged,
    isSubmittable:
      isTitleValid && isContentValid && (!requiresChange || hasFormChanged),
    titleErrorMessage: shouldShowTitleError
      ? '제목을 입력해주세요.'
      : undefined,
    contentErrorMessage: shouldShowContentError
      ? '내용을 입력해주세요.'
      : undefined,
    setIsSubmitted,
    defaultFormData,
    handleDiscardChanges,
    handleTitleChange,
    handleContentChange,
    handleTitleBlur,
    handleContentBlur,
    handleImageChange,
  };
}
