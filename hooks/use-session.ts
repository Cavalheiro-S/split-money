"use client";

import { STORAGE_KEYS } from "@/consts/storage";
import {
  clearSession,
  getSession,
  isSessionValid,
  SessionData,
  setSession,
} from "@/utils/session";
import { useEffect, useRef, useState } from "react";

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
      console.error("Erro ao carregar sessão:", error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = (accessToken: string, user: User, expiresAt: number) => {
    try {
      const sessionData: SessionData = {
        accessToken,
        user,
        expiresAt,
      };

      setSession(sessionData);
      setSessionState(sessionData);
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
    }
  };

  const clearSessionData = () => {
    try {
      clearSession();
      setSessionState(null);
    } catch (error) {
      console.error("Erro ao limpar sessão:", error);
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
    loadSession,
  };
}
