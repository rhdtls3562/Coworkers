/**
 * 이미지 크롭 모달 컴포넌트입니다.
 * react-easy-crop 라이브러리를 사용해 원형(프로필) 또는 정사각형(팀) 크롭을 지원합니다.
 */
'use client';

import { useCallback, useEffect, useState } from 'react';

import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

import { getCroppedImageFile } from '@/components/common/imageCrop/utils/imageCropUtils';
import ModalPortal from '@/components/common/modal/components/ModalPortal';

import type { Area } from 'react-easy-crop';

type ImageCropModalProps = {
  cropShape: 'round' | 'rect';
  fileName: string;
  imageSrc: string;
  onClose: () => void;
  onComplete: (file: File) => void;
};

export default function ImageCropModal({
  cropShape,
  fileName,
  imageSrc,
  onClose,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const croppedFile = await getCroppedImageFile(
        imageSrc,
        croppedAreaPixels,
        fileName,
      );
      onComplete(croppedFile);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 px-4 py-6"
        onClick={onClose}
      >
        <div
          className="relative w-full bg-background-primary rounded-3xl p-6 max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xl font-bold text-center mb-5">이미지 편집</p>

          <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-text-secondary whitespace-nowrap">
              축소
            </span>
            <input
              type="range"
              name="zoom"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              aria-label="이미지 확대/축소"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-brand-primary"
            />
            <span className="text-xs text-text-secondary whitespace-nowrap">
              확대
            </span>
          </div>

          <div className="flex gap-2 mt-6 w-full mx-auto max-w-90">
            <button
              type="button"
              className="border border-border-secondary rounded-xl px-4 py-2.75 w-full text-text-default font-medium hover:bg-background-secondary"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              className="bg-brand-primary rounded-xl px-4 py-2.75 w-full text-white font-medium hover:enabled:bg-interaction-hover disabled:bg-interaction-inactive"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              적용
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
