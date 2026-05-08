'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { OAUTH_SIGNUP_TEXT } from '@/app/(service)/oauth/signup/[provider]/constants';
import { useSignInWithOauthMutation } from '@/hooks/useAuth';
import { buildLoginPath, resolvePostAuthPath } from '@/utils/authRedirect';
import { extractAuthSession, saveAuthSession } from '@/utils/authSession';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;
const SUPPORTED_OAUTH_PROVIDER = 'kakao';
const OAUTH_CODE_SESSION_STORAGE_KEY = 'coworkers-oauth-code';

type UseOauthSignupPageParams = {
  code?: string;
  error?: string;
  provider: string;
  state?: string;
};

function toOauthProvider(provider: string) {
  return provider.toUpperCase();
}

function buildProcessedOauthCodeKey(provider: string, code: string) {
  return `${OAUTH_CODE_SESSION_STORAGE_KEY}:${provider}:${code}`;
}

export default function useOauthSignupPage({
  code,
  error,
  provider,
  state,
}: UseOauthSignupPageParams) {
  const router = useRouter();
  const hasStartedRef = useRef(false);
  const [mutationErrorMessage, setMutationErrorMessage] = useState('');
  const signInWithOauthMutation = useSignInWithOauthMutation({
    onError: (mutationError) => {
      setMutationErrorMessage(
        mutationError.message || OAUTH_SIGNUP_TEXT.defaultError,
      );
    },
    onSuccess: (data) => {
      const session = extractAuthSession(data);

      if (!session) {
        setMutationErrorMessage(OAUTH_SIGNUP_TEXT.invalidSession);
        return;
      }

      saveAuthSession(session);
      router.replace(resolvePostAuthPath(TEAM_ID, state));
    },
  });
  const initialErrorMessage =
    provider !== SUPPORTED_OAUTH_PROVIDER
      ? OAUTH_SIGNUP_TEXT.unsupportedProvider
      : error
        ? OAUTH_SIGNUP_TEXT.defaultError
        : !TEAM_ID
          ? OAUTH_SIGNUP_TEXT.missingTeam
          : !code
            ? OAUTH_SIGNUP_TEXT.missingCode
            : '';

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    if (initialErrorMessage) {
      return;
    }

    const oauthCode = code;
    const teamId = TEAM_ID;

    if (!oauthCode) {
      return;
    }

    if (!teamId) {
      return;
    }

    const processedCodeKey = buildProcessedOauthCodeKey(provider, oauthCode);

    if (window.sessionStorage.getItem(processedCodeKey)) {
      return;
    }

    window.sessionStorage.setItem(processedCodeKey, 'true');
    hasStartedRef.current = true;

    signInWithOauthMutation.mutate({
      body: {
        redirectUri: `${window.location.origin}${window.location.pathname}`,
        state,
        token: oauthCode,
      },
      provider: toOauthProvider(provider),
      teamId,
    });
  }, [code, initialErrorMessage, provider, signInWithOauthMutation, state]);

  return {
    errorMessage: mutationErrorMessage || initialErrorMessage,
    handleGoLogin: () => {
      router.replace(buildLoginPath({ redirectTo: state }));
    },
    isPending: signInWithOauthMutation.isPending,
  };
}
