'use client';

import { useEffect, useState, useRef } from 'react';
import { getSession, setSession, clearSession, isSessionValid, SessionData } from '@/utils/session';

export function useSession() {
  const [session, setSessionState] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      loadSession();
      hasLoaded.current = true;
    }
  }, []);

  const loadSession = () => {
    try {
      const storedSession = getSession();
      if (storedSession && isSessionValid(storedSession)) {
        setSessionState(storedSession);
      } else if (storedSession) {
        clearSession();
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = (accessToken: string, user: any, expiresAt: number) => {
    try {
      const sessionData: SessionData = {
        accessToken,
        user,
        expiresAt
      };
      
      setSession(sessionData);
      setSessionState(sessionData);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const clearSessionData = () => {
    try {
      clearSession();
      setSessionState(null);
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
    }
  };

  const isSessionValidData = () => {
    return session && isSessionValid(session);
  };

  return {
    session,
    isLoading,
    saveSession,
    clearSession: clearSessionData,
    isSessionValid: isSessionValidData,
    loadSession
  };
}
