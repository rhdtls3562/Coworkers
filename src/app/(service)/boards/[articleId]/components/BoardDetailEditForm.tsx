'use client';

import useBoardEditForm from '@/app/(service)/boards/[articleId]/hooks/useBoardEditForm';
import BoardEditorForm from '@/app/(service)/boards/components/BoardEditorForm';
import type { Post } from '@/app/(service)/boards/types';

export default function BoardDetailEditForm({
  boardDetail,
}: {
  boardDetail: Post;
}) {
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
  } = useBoardEditForm({
    articleId: boardDetail.id,
    title: boardDetail.title,
    content: boardDetail.content,
    image: boardDetail.image,
  });

  return (
    <BoardEditorForm
      heading="게시글 수정"
      submitLabel="수정하기"
      imageButtonAriaLabel="게시글 이미지 수정"
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
