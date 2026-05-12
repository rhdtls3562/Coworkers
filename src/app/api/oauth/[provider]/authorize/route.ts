import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { ROUTES } from '@/constants/ROUTES';
import { getSafeRedirectTo } from '@/utils/authRedirect';
import { buildOauthCallbackUrl } from '@/utils/oauthRedirect';

const SUPPORTED_OAUTH_PROVIDER = 'kakao';
const KAKAO_PROFILE_SCOPES = ['profile_nickname', 'profile_image'];
const OAUTH_NOT_CONFIGURED_ERROR = 'oauth_not_configured';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;

  if (provider !== SUPPORTED_OAUTH_PROVIDER) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  const clientId =
    process.env.KAKAO_CLIENT_ID ?? process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL(
        `${ROUTES.LOGIN}?error=${OAUTH_NOT_CONFIGURED_ERROR}`,
        request.url,
      ),
    );
  }

  const redirectUri = buildOauthCallbackUrl(provider, request.nextUrl.origin);
  const authorizeUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  const redirectTo = getSafeRedirectTo(
    request.nextUrl.searchParams.get('redirectTo'),
  );

  if (!redirectUri) {
    return NextResponse.redirect(
      new URL(
        `${ROUTES.LOGIN}?error=${OAUTH_NOT_CONFIGURED_ERROR}`,
        request.url,
      ),
    );
  }

  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('scope', KAKAO_PROFILE_SCOPES.join(','));

  if (redirectTo) {
    authorizeUrl.searchParams.set('state', redirectTo);
  }

  return NextResponse.redirect(authorizeUrl);
}
