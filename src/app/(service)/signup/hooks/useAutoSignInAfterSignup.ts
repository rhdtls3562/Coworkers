/**
 * 회원가입 직후 자동 로그인을 처리하는 훅입니다.
 */

'use client';

import { useRouter } from 'next/navigation';

import { useToast } from '@/components/common/toast';
import { useSignInMutation } from '@/hooks/useAuth';
import { buildLoginPath, resolvePostAuthPath } from '@/utils/authRedirect';
import { extractAuthSession, saveAuthSession } from '@/utils/authSession';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

type UseAutoSignInAfterSignupParams = {
  redirectTo?: string;
};

type HandleSignUpSuccessParams = {
  email: string;
  password: string;
  teamId: string;
};

export default function useAutoSignInAfterSignup({
  redirectTo,
}: UseAutoSignInAfterSignupParams) {
  const router = useRouter();
  const { showToast } = useToast();
  const signInMutation = useSignInMutation({
    onError: (_, variables) => {
      showToast(
        '가입은 완료되었지만 자동 로그인에 실패했습니다. 비밀번호를 입력해 로그인해주세요.',
        'error',
      );
      router.push(
        buildLoginPath({
          email: variables.body.email,
          redirectTo,
        }),
      );
    },
    onSuccess: (data) => {
      const session = extractAuthSession(data);

      if (!session) {
        showToast(
          '가입은 완료되었지만 자동 로그인에 실패했습니다. 다시 로그인해주세요.',
          'error',
        );
        router.push(buildLoginPath({ redirectTo }));
        return;
      }

      saveAuthSession(session);
      showToast('가입과 로그인이 완료되었습니다.', 'success');
      router.push(resolvePostAuthPath(TEAM_ID, redirectTo));
    },
  });

  return {
    handleSignUpSuccess: ({
      email,
      password,
      teamId,
    }: HandleSignUpSuccessParams) => {
      signInMutation.mutate({
        body: {
          email,
          password,
        },
        teamId,
      });
    },
    isPending: signInMutation.isPending,
  };
}
