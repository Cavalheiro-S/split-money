'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/consts/storage';

export interface SessionData {
  accessToken: string;
  user: User;
  expiresAt: number;
}

export interface AuthContextType {
  user: User | null;
  session: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string, user: User, expiresIn: number) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SESSION_REFRESH_THRESHOLD = 5 * 60 * 1000;
const SESSION_CHECK_INTERVAL = 30 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!stored) return null;
    
    const session: SessionData = JSON.parse(stored);
    return session;
  } catch (error) {
    console.error('Erro ao obter sessão do localStorage:', error);
    return null;
  }
}

function saveStoredSession(session: SessionData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
  }
}

function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
  }
}

function isSessionValid(session: SessionData | null): boolean {
  if (!session) return false;
  return session.expiresAt > Date.now();
}

function shouldRefreshSession(session: SessionData | null): boolean {
  if (!session) return false;
  const timeUntilExpiry = session.expiresAt - Date.now();
  return timeUntilExpiry > 0 && timeUntilExpiry <= SESSION_REFRESH_THRESHOLD;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isInitialized = useRef(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshSessionRef = useRef<(() => Promise<void>) | null>(null);

  const clearSession = useCallback(() => {
    setSession(null);
    setUser(null);
    clearStoredSession();
    
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  }, []);

  const scheduleTokenRefresh = useCallback((expiresAt: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const timeUntilRefresh = expiresAt - Date.now() - SESSION_REFRESH_THRESHOLD;
    
    if (timeUntilRefresh > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshSessionRef.current?.();
      }, timeUntilRefresh);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken && data.user && data.expiresIn) {
          const expiresAt = Date.now() + data.expiresIn * 1000;
          const newSession: SessionData = {
            accessToken: data.accessToken,
            user: data.user,
            expiresAt,
          };
          
          setSession(newSession);
          setUser(data.user);
          saveStoredSession(newSession);
          scheduleTokenRefresh(expiresAt);
        }
      } else {
        clearSession();
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      }
    } catch (error) {
      console.error('Erro ao renovar sessão:', error);
    }
  }, [clearSession, scheduleTokenRefresh]);

  refreshSessionRef.current = refreshSession;

  const login = useCallback((accessToken: string, user: User, expiresIn: number) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    const newSession: SessionData = {
      accessToken,
      user,
      expiresAt,
    };
    
    setSession(newSession);
    setUser(user);
    saveStoredSession(newSession);
    scheduleTokenRefresh(expiresAt);
    
    if (!checkIntervalRef.current) {
      checkIntervalRef.current = setInterval(() => {
        const currentSession = getStoredSession();
        if (!isSessionValid(currentSession)) {
          clearSession();
          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in';
          }
        }
      }, SESSION_CHECK_INTERVAL);
    }
  }, [clearSession, scheduleTokenRefresh]);

  const logout = useCallback(async () => {
    clearSession();
    
    fetch('/api/auth/sign-out', {
      method: 'POST',
      credentials: 'include',
    }).catch(error => {
      console.error('Erro ao fazer logout:', error);
    });
    
    window.location.href = '/sign-in';
  }, [clearSession]);

  useEffect(() => {
    if (isInitialized.current) return;
    
    const initializeAuth = async () => {
      try {
        const storedSession = getStoredSession();
        
        if (storedSession && isSessionValid(storedSession)) {
          setSession(storedSession);
          setUser(storedSession.user);
          scheduleTokenRefresh(storedSession.expiresAt);
          
          if (shouldRefreshSession(storedSession)) {
            await refreshSession();
          }
          
          checkIntervalRef.current = setInterval(() => {
            const currentSession = getStoredSession();
            if (!isSessionValid(currentSession)) {
              clearSession();
              if (typeof window !== 'undefined') {
                window.location.href = '/sign-in';
              }
            }
          }, SESSION_CHECK_INTERVAL);
        } else if (storedSession) {
          clearStoredSession();
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        clearStoredSession();
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    initializeAuth();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [clearSession, router, refreshSession, scheduleTokenRefresh]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && isSessionValid(session),
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

