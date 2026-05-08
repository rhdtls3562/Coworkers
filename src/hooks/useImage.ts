/**
 * 프로필 이미지와 팀 이미지 업로드를 담당하는 훅 파일입니다.
 */

'use client';

import { useMutation } from '@tanstack/react-query';

import { uploadImage } from '@/api/imageApi';
import { queryKeys } from '@/api/queryKeys';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
} from '@/api/queryOptions/factory';

type UploadImageVariables = {
  file: File;
  teamId: string;
  token?: string;
};

type UploadImageData = Awaited<ReturnType<typeof uploadImage>>;

export function useUploadImageMutation(
  options?: MutationOptionsOverrides<UploadImageData, UploadImageVariables>,
) {
  return useMutation(
    createMutationOptions({
      mutationFn: ({ file }: UploadImageVariables) => uploadImage(file),
      mutationKey: queryKeys.image.upload(),
      options,
    }),
  );
}
