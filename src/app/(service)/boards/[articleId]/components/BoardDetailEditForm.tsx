'use client';

import useBoardEditForm from '@/app/(service)/boards/[articleId]/hooks/useBoardEditForm';
import BoardPostForm from '@/app/(service)/boards/components/BoardPostForm';
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
    <BoardPostForm
      heading="게시글 수정"
      submitLabel="수정하기"
      imageButtonAriaLabel="게시글 이미지 수정"
      innerClassName="px-5.5 py-9.75 md:px-10 md:py-13.5 lg:px-15"
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
