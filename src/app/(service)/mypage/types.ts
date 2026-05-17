/** 마이페이지 TypeScript 타입 정의 파일입니다. */

import { z } from 'zod';

import { accountSchema } from '@/app/(service)/mypage/schemas/accountSchema';

export type AccountFormProps = {
  isDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  userInfo: UserInfo;
  onSubmitData: (
    data: Partial<Pick<UserInfo, 'nickname' | 'image'>>,
  ) => Promise<UserInfo>;
  onSubmitError?: string | null;
};

export type UseAccountFormProps = {
  initialEmail: string;
  initialName: string;
  initialImage?: string | null;
  isDirty: boolean;
  onDirtyChange: (value: boolean) => void;
  onSubmitData: (
    data: Partial<Pick<UserInfo, 'nickname' | 'image'>>,
  ) => Promise<UserInfo>;
};
export type AccountFormValues = z.infer<typeof accountSchema>;

export type UserInfo = {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
  memberships?: { groupId: number }[];
};

export type ChangePassword = {
  password: string;
  passwordConfirmation: string;
};

export type PasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};
