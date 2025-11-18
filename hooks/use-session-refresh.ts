'use client';

import { useEffect, useRef } from 'react';
import { useSession } from '@/hooks/use-session';
import { useUser } from '@/contexts/user-context';
import { shouldRefreshSession, getTimeUntilRefresh } from '@/utils/session';

export function useSessionRefresh() {
  const { session, isSessionValid, clearSession } = useSession();
  const { user } = useUser();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasScheduledRefresh = useRef(false);

  useEffect(() => {
    if (!session || !isSessionValid() || hasScheduledRefresh.current) {
      return;
    }

    if (shouldRefreshSession(session)) {
      refreshSession();
    } else {
      const timeUntilRefresh = getTimeUntilRefresh(session);
      if (timeUntilRefresh > 0) {
        hasScheduledRefresh.current = true;
        refreshTimeoutRef.current = setTimeout(() => {
          refreshSession();
          hasScheduledRefresh.current = false;
        }, timeUntilRefresh);
      }
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        hasScheduledRefresh.current = false;
      }
    };
  }, [session, isSessionValid, clearSession]);

  const refreshSession = async () => {
    try {
      const response = await fetch('/api/auth/get-token');
      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }
      
      const data = await response.json();
      if (data.accessToken && user) {
        console.log('Token renovado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      clearSession();
    }
  };

  return null;
}
