import { z } from 'zod';

import { accountSchema } from '@/app/(service)/mypage/schemas/accountSchema';

export type AccountFormProps = {
  isDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
};

export type AccountFormValues = z.infer<typeof accountSchema>;

export type UseAccountFormProps = {
  initialEmail: string;
  initialName: string;
  isDirty: boolean;
  onDirtyChange: (value: boolean) => void;
};
