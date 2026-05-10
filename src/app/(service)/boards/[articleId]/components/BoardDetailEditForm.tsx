'use client';

import useBoardWrite from '@/app/(service)/boards/hooks/useBoardWrite';
import { Post } from '@/app/(service)/boards/types';
import { IcStarRed } from '@/assets';
import Button from '@/components/common/button/components/Button';
import {
  ContentTextarea,
  ImageUploadField,
  TitleInput,
} from '@/components/common/form';
import { cn } from '@/utils/cn';

export default function BoardDetailEditForm({
  boardDetail,
}: {
  boardDetail: Post;
}) {
  const {
    formData,
    isLoading,
    handleTitleChange,
    handleContentChange,
    handleImageChange,
    handleSubmit,
  } = useBoardWrite({
    title: boardDetail.title,
    content: boardDetail.content,
    image: boardDetail.image,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-5.5 py-9.75 md:px-10 md:py-13.5 lg:px-15">
        <h2 className="text-text-primary text-xl font-bold leading-6">
          게시글 수정
        </h2>
        <div className="mt-8 md:mt-10">
          <div>
            <div className="flex items-center gap-1 md:gap-1.5">
              <p className="text-text-primary text-sm font-bold md:text-base">
                제목
              </p>
              <IcStarRed
                width={8}
                height={8}
                role="img"
                aria-label="필수 입력"
              />
            </div>
            <TitleInput
              id="title"
              placeholder="제목을 입력해주세요."
              className="mt-2.25 md:mt-3"
              value={formData.title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="mt-6 md:mt-8">
            <div className="flex items-center gap-1 md:gap-1.5">
              <p className="text-text-primary text-sm font-bold md:text-base">
                내용
              </p>
              <IcStarRed
                width={8}
                height={8}
                role="img"
                aria-label="필수 입력"
              />
            </div>
            <ContentTextarea
              id="content"
              placeholder="내용을 입력하세요"
              className="mt-2 h-50 md:mt-3 md:h-60"
              value={formData.content}
              onChange={handleContentChange}
            />
          </div>
          <div className="mt-6 md:mt-8">
            <p className="text-text-primary text-sm font-bold md:text-base">
              이미지
            </p>
            <ImageUploadField
              variant="post"
              src={formData.image || null}
              previewAlt="게시글 이미지"
              buttonAriaLabel="게시글 이미지 수정"
              onChangeFile={handleImageChange}
            />
          </div>
          <div className="mt-12 md:mt-14.25">
            <Button
              className={cn(
                'bg-brand-primary text-text-inverse hover:bg-interaction-hover',
                'font-semibold text-base leading-4.75',
                'w-full h-12 py-3.5 rounded-xl',
              )}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '수정 중...' : '수정하기'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
