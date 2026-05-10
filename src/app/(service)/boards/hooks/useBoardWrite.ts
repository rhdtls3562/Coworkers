'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';

export default function useBoardWrite(initialData?: {
  title: string;
  content: string;
  image: string | null;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    image: initialData?.image || null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, title: e.target.value }));
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, content: e.target.value }));
  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      setFormData((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('제목과 내용을 모두 입력해주세요.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      showToast('게시글이 성공적으로 수정되었습니다.', 'success');
      router.push(ROUTES.BOARDS);
    } catch {
      showToast('수정 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    imageFile,
    isLoading,
    handleTitleChange,
    handleContentChange,
    handleImageChange,
    handleSubmit,
  };
}
