'use client';

import BoardEditorForm from '@/app/(service)/boards/components/BoardEditorForm';
import useBoardCreateForm from '@/app/(service)/boards/hooks/useBoardCreateForm';

export default function BoardCreateForm() {
  const {
    formData,
    isLoading,
    isSubmitDisabled,
    titleErrorMessage,
    contentErrorMessage,
    handleTitleChange,
    handleContentChange,
    handleTitleBlur,
    handleContentBlur,
    handleImageChange,
    handleSubmit,
  } = useBoardCreateForm();

  return (
    <BoardEditorForm
      heading="게시글 쓰기"
      submitLabel="등록하기"
      imageButtonAriaLabel="게시글 이미지 추가"
      formClassName="w-full h-full min-h-dvh flex justify-center items-center px-4 py-8 md:px-6.5 md:py-31.75 lg:py-25"
      outerClassName="max-w-225 items-center bg-background-primary rounded-[20px] w-full"
      innerClassName="px-5.5 py-11.25 md:px-10 md:py-18 lg:px-17.5"
      formData={formData}
      isLoading={isLoading}
      isSubmitDisabled={isSubmitDisabled}
      titleErrorMessage={titleErrorMessage}
      contentErrorMessage={contentErrorMessage}
      onTitleChange={handleTitleChange}
      onContentChange={handleContentChange}
      onTitleBlur={handleTitleBlur}
      onContentBlur={handleContentBlur}
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
    />
  );
}
