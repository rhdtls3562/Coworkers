'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import useBoardFormFields from '@/app/(service)/boards/hooks/useBoardFormFields';
import { normalizeArticleImageUrl } from '@/app/(service)/boards/utils/boardUtils';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useCreateArticleMutation } from '@/hooks/useArticle';
import { useUploadImageMutation } from '@/hooks/useImage';
import { getStoredAccessToken } from '@/utils/authSession';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function useBoardCreateForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const createArticleMutation = useCreateArticleMutation();
  const uploadImageMutation = useUploadImageMutation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    contentErrorMessage,
    formData,
    handleContentBlur,
    handleContentChange,
    handleImageChange,
    handleTitleBlur,
    handleTitleChange,
    imageFile,
    isSubmittable,
    setIsSubmitted,
    titleErrorMessage,
  } = useBoardFormFields();

  const isMutationPending =
    uploadImageMutation.isPending || createArticleMutation.isPending;
  const isSubmitBusy = isLoading || isMutationPending;
  const isSubmitDisabled = isSubmitBusy || !isSubmittable;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!isSubmittable) {
      return;
    }

    if (!TEAM_ID) {
      showToast('팀 정보가 설정되지 않았습니다.', 'error');
      return;
    }

    if (isSubmitBusy) {
      return;
    }

    try {
      setIsLoading(true);
      const token = getStoredAccessToken() ?? undefined;
      const uploadedImage = imageFile
        ? await uploadImageMutation.mutateAsync({ file: imageFile })
        : null;

      const imageForRequest = normalizeArticleImageUrl(
        uploadedImage ? uploadedImage.url : formData.image,
      );

      await createArticleMutation.mutateAsync({
        body: {
          content: formData.content.trim(),
          image: imageForRequest,
          title: formData.title.trim(),
        },
        teamId: TEAM_ID,
        token,
      });

      showToast('게시글이 성공적으로 등록되었습니다.', 'success');
      router.push(ROUTES.BOARDS);
    } catch {
      showToast('등록 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading: isSubmitBusy,
    isSubmitDisabled,
    titleErrorMessage,
    contentErrorMessage,
    handleTitleChange,
    handleContentChange,
    handleTitleBlur,
    handleContentBlur,
    handleImageChange,
    handleSubmit,
  };
}
