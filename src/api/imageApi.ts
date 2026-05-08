/**
 * 프로필 이미지와 팀 이미지 업로드 관련 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import {
  API_FORM_DATA_FIELDS,
  API_PATH_SEGMENTS,
  HTTP_METHODS,
} from '@/api/constants';
import type { UploadImageResponse } from '@/api/types';

export async function uploadImage(file: File) {
  const body = new FormData();
  body.append(API_FORM_DATA_FIELDS.IMAGE, file);

  return apiClient<UploadImageResponse>(
    teamEndpoint(`${API_PATH_SEGMENTS.IMAGES}/upload`),
    {
      body,
      method: HTTP_METHODS.POST,
    },
  );
}
