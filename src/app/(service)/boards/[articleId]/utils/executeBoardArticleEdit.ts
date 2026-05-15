/**
 * 게시글 수정 시 선택 이미지 업로드 후 `updateArticle` 요청 본문까지 한 번에 실행합니다.
 */

import type { QueryKeyId } from '@/api/queryKeys';
import type { UploadImageResponse } from '@/api/types';
import { buildArticleMutationBody } from '@/app/(service)/boards/utils/boardFormUtils';

type BoardEditFormSnapshot = {
  content: string;
  image: string | null;
  title: string;
};

type UploadImageMutateAsync = (variables: { file: File }) => Promise<unknown>;

type UpdateArticleMutateAsync = (variables: {
  articleId: QueryKeyId;
  body: ReturnType<typeof buildArticleMutationBody>;
  teamId: string;
  token?: string;
}) => Promise<unknown>;

export async function executeBoardArticleEdit(params: {
  articleId: QueryKeyId;
  formData: BoardEditFormSnapshot;
  imageFile: File | null;
  teamId: string;
  token?: string;
  updateArticleMutateAsync: UpdateArticleMutateAsync;
  uploadImageMutateAsync: UploadImageMutateAsync;
}) {
  const {
    articleId,
    formData,
    imageFile,
    teamId,
    token,
    updateArticleMutateAsync,
    uploadImageMutateAsync,
  } = params;

  const uploadedImage = imageFile
    ? ((await uploadImageMutateAsync({
        file: imageFile,
      })) as UploadImageResponse)
    : null;

  await updateArticleMutateAsync({
    articleId,
    body: buildArticleMutationBody(
      {
        content: formData.content,
        image: uploadedImage?.url ?? formData.image,
        title: formData.title,
      },
      { includeNullImage: true },
    ),
    teamId,
    token,
  });
}
