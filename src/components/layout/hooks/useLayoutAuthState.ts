'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_LAYOUT_CURRENT_USER,
  isGuestLayoutPath,
} from '@/components/layout/constants';
import type { LayoutAuthState } from '@/components/layout/types/auth';
import {
  getCurrentUser,
  getProfileTeamName,
} from '@/components/layout/utils/layoutAuthStateHelpers';
import {
  toMeResponse,
  toSidebarTeams,
} from '@/components/layout/utils/layoutAuthStateParsers';
import { useMeQuery, useMyMembershipsQuery } from '@/hooks/useUser';
import {
  hasAuthSession,
  subscribeAuthSessionChange,
} from '@/utils/authSession';

export default function useLayoutAuthState(pathname: string | null) {
  const [isSessionReady, setIsSessionReady] = useState(false);
  const isAuthenticated = isSessionReady && !isGuestLayoutPath(pathname);

  const { data: meResponse } = useMeQuery<unknown>({
    options: {
      enabled: isAuthenticated,
    },
  });
  const { data: membershipsData } = useMyMembershipsQuery<unknown>({
    options: {
      enabled: isAuthenticated,
    },
  });

  const teams = useMemo(() => {
    if (!isAuthenticated) {
      return [];
    }

    const membershipTeams = toSidebarTeams(membershipsData);

    if (membershipTeams.length > 0) {
      return membershipTeams;
    }

    return toSidebarTeams(meResponse);
  }, [isAuthenticated, meResponse, membershipsData]);

  const meData = useMemo(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    return toMeResponse(meResponse);
  }, [isAuthenticated, meResponse]);

  useEffect(() => {
    const syncLayoutAuthState = () => setIsSessionReady(hasAuthSession());
    syncLayoutAuthState();
    return subscribeAuthSessionChange(syncLayoutAuthState);
  }, []);

  return useMemo(
    (): LayoutAuthState => ({
      currentUser: isAuthenticated
        ? getCurrentUser(pathname, meData, teams)
        : DEFAULT_LAYOUT_CURRENT_USER,
      isAuthenticated,
      profileTeamName: isAuthenticated ? getProfileTeamName(teams) : undefined,
      teams: isAuthenticated ? teams : [],
    }),
    [isAuthenticated, meData, pathname, teams],
  );
}
