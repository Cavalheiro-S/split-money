'use client';

import { useEffect, useRef } from 'react';
import { useSession } from '@/hooks/use-session';
import { useUser } from '@/contexts/user-context';
import { useSessionRefresh } from '@/hooks/use-session-refresh';
import { useApiDebug } from '@/hooks/use-api-debug';

export function SessionInitializer() {
  const { session, isSessionValid, clearSession } = useSession();
  const { setUser, user } = useUser();
  const hasInitialized = useRef(false);
  
  useSessionRefresh();
  useApiDebug();

  useEffect(() => {
    if (hasInitialized.current || !session || !isSessionValid()) {
      return;
    }

    if (user) {
      hasInitialized.current = true;
      return;
    }

    if (session.user) {
      setUser(session.user);
      hasInitialized.current = true;
    }
  }, [session, isSessionValid, setUser, user]);

  useEffect(() => {
    if (session && !isSessionValid()) {
      clearSession();
      hasInitialized.current = false;
    }
  }, [session, isSessionValid, clearSession]);

  return null;
}
