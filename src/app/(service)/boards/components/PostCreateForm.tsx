'use client';

import useBoardWrite from '@/app/(service)/boards/hooks/useBoardWrite';
import { IcStarRed } from '@/assets';
import Button from '@/components/common/button/components/Button';
import {
  ContentTextarea,
  ImageUploadField,
  TitleInput,
} from '@/components/common/form';
import { cn } from '@/utils/cn';

export default function PostCreateForm() {
  const {
    formData,
    isLoading,
    handleTitleChange,
    handleContentChange,
    handleImageChange,
    handleSubmit,
  } = useBoardWrite();

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full min-h-dvh flex justify-center items-center px-4 py-8 md:px-6.5 md:py-31.75 lg:py-25"
    >
      <div className="max-w-225 max-h-219.75 h-full items-center bg-background-primary rounded-[20px] w-full">
        <div className="px-5.5 py-11.25 md:px-10 md:py-18 lg:px-17.5">
          <h2 className="text-text-primary text-xl font-bold leading-6">
            게시글 쓰기
          </h2>
          <div className="mt-8 md:mt-10">
            <div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <span className="block text-text-primary text-sm font-bold md:text-base">
                  제목
                </span>
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
                <span className="block text-text-primary text-sm font-bold md:text-base">
                  내용
                </span>
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
              <span className="block text-text-primary text-sm font-bold md:text-base">
                이미지
              </span>
              <ImageUploadField
                variant="post"
                src={formData.image || null}
                previewAlt="게시글 이미지"
                buttonAriaLabel="게시글 이미지 추가"
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
                {isLoading ? '등록 중...' : '등록하기'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
