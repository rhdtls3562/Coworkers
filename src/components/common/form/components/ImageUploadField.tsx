'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import {
  IcCloseLarge,
  IcPlusBoard,
  IcProfileEditLarge,
  IcUserLarge,
} from '@/assets';
import type { ImageUploadFieldProps } from '@/components/common/form/types';

function revokeObjectUrl(src: string | null) {
  if (!src?.startsWith('blob:')) {
    return;
  }

  URL.revokeObjectURL(src);
}

export default function ImageUploadField({
  buttonAriaLabel,
  disabled = false,
  onChangeFile,
  previewAlt,
  src,
  variant,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localPreviewSrc, setLocalPreviewSrc] = useState<string | null>(null);
  const previewSrc = localPreviewSrc ?? src ?? null;
  const hasPreview = Boolean(previewSrc);

  useEffect(() => {
    return () => {
      revokeObjectUrl(localPreviewSrc);
    };
  }, [localPreviewSrc]);

  const handleSelectFile = (file: File | null) => {
    revokeObjectUrl(localPreviewSrc);

    if (!file) {
      setLocalPreviewSrc(null);
      onChangeFile?.(null);
      return;
    }

    const nextPreviewSrc = URL.createObjectURL(file);
    setLocalPreviewSrc(nextPreviewSrc);
    onChangeFile?.(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectFile(event.target.files?.[0] ?? null);
  };

  const handleOpenFileDialog = () => {
    if (disabled || (variant === 'post' && hasPreview)) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    handleSelectFile(null);
  };

  if (variant === 'profile') {
    return (
      <div className="mx-auto w-fit">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={handleOpenFileDialog}
          className="relative h-16 w-16 md:h-25 md:w-25"
          aria-label={buttonAriaLabel}
          disabled={disabled}
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] border-2 border-border-primary bg-border-secondary md:rounded-4xl">
            {previewSrc ? (
              <Image
                src={previewSrc}
                alt={previewAlt}
                width={98}
                height={98}
                loading="eager"
                className="h-full w-full object-cover"
              />
            ) : (
              <IcUserLarge
                width={64}
                height={64}
                className="h-10 w-10 md:h-16 md:w-16"
                aria-hidden="true"
              />
            )}
          </div>
          <IcProfileEditLarge
            width={32}
            height={32}
            className="absolute -right-1 bottom-0 h-5 w-5 rounded-3xl border-2 border-background-secondary md:-right-2 md:h-8 md:w-8 md:border-0"
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {previewSrc && (
        <div className="relative">
          <div className="mt-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl md:mt-3 md:h-30 md:w-30">
            <Image
              src={previewSrc}
              alt={previewAlt}
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            aria-label="업로드한 이미지 삭제"
            onClick={handleRemove}
            className="absolute top-1 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border-secondary bg-background-primary"
          >
            <IcCloseLarge
              width={18}
              height={18}
              className="h-4.5 w-4.5 fill-icon-primary"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {!previewSrc && (
        <button
          type="button"
          aria-label={buttonAriaLabel}
          className="mt-2 flex h-20 w-20 items-center justify-center rounded-xl border border-background-tertiary md:mt-3 md:h-30 md:w-30"
          onClick={handleOpenFileDialog}
          disabled={disabled || hasPreview}
        >
          <IcPlusBoard
            width={20}
            height={20}
            className="h-5 w-5 fill-background-tertiary md:h-7.5 md:w-7.5"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
