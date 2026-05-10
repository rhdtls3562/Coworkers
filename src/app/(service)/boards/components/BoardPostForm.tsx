'use client';

import { IcStarRed } from '@/assets';
import Button from '@/components/common/button/components/Button';
import {
  ContentTextarea,
  ImageUploadField,
  TitleInput,
} from '@/components/common/form';
import { cn } from '@/utils/cn';

type BoardPostFormProps = {
  contentErrorMessage?: string;
  formClassName?: string;
  formData: { content: string; image: string | null; title: string };
  heading: string;
  imageButtonAriaLabel: string;
  innerClassName: string;
  isLoading: boolean;
  isSubmitDisabled: boolean;
  onContentBlur: () => void;
  onContentChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onImageChange: (file: File | null) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onTitleBlur: () => void;
  onTitleChange: React.ChangeEventHandler<HTMLInputElement>;
  outerClassName?: string;
  submitLabel: string;
  titleErrorMessage?: string;
};
const LABEL_ROW = 'flex items-center gap-1 md:gap-1.5';
const FIELD_LABEL = 'block text-text-primary text-sm font-bold md:text-base';

export default function BoardPostForm({
  contentErrorMessage,
  formClassName,
  formData,
  heading,
  imageButtonAriaLabel,
  innerClassName,
  isLoading,
  isSubmitDisabled,
  onContentBlur,
  onContentChange,
  onImageChange,
  onSubmit,
  onTitleBlur,
  onTitleChange,
  outerClassName,
  submitLabel,
  titleErrorMessage,
}: BoardPostFormProps) {
  const main = (
    <>
      <h2 className="text-text-primary text-xl font-bold leading-6">
        {heading}
      </h2>
      <div className="mt-8 md:mt-10">
        <div>
          <div className={LABEL_ROW}>
            <label htmlFor="title" className={FIELD_LABEL}>
              제목
            </label>
            <IcStarRed width={8} height={8} role="img" aria-label="필수 입력" />
          </div>
          <TitleInput
            id="title"
            placeholder="제목을 입력해주세요."
            className="mt-2.25 md:mt-3"
            value={formData.title}
            errorMessage={titleErrorMessage}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
          />
        </div>
        <div className="mt-6 md:mt-8">
          <div className={LABEL_ROW}>
            <label htmlFor="content" className={FIELD_LABEL}>
              내용
            </label>
            <IcStarRed width={8} height={8} role="img" aria-label="필수 입력" />
          </div>
          <ContentTextarea
            id="content"
            placeholder="내용을 입력하세요"
            className="mt-2 h-50 md:mt-3 md:h-60"
            value={formData.content}
            errorMessage={contentErrorMessage}
            onChange={onContentChange}
            onBlur={onContentBlur}
          />
        </div>
        <div className="mt-6 md:mt-8">
          <label htmlFor="image" className={FIELD_LABEL}>
            이미지
          </label>
          <ImageUploadField
            variant="post"
            src={formData.image || null}
            previewAlt="게시글 이미지"
            buttonAriaLabel={imageButtonAriaLabel}
            onChangeFile={onImageChange}
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
            disabled={isSubmitDisabled}
            aria-busy={isLoading}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <form onSubmit={onSubmit} className={formClassName}>
      {outerClassName ? (
        <div className={outerClassName}>
          <div className={innerClassName} data-allow-unsaved="true">
            {main}
          </div>
        </div>
      ) : (
        <div className={innerClassName} data-allow-unsaved="true">
          {main}
        </div>
      )}
    </form>
  );
}
