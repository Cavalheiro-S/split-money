'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { UserService } from '@/services/user.service';
import { clearTokenCache } from '@/utils/data';
import { useSession } from '@/hooks/use-session';
import { STORAGE_KEYS } from '@/consts/storage';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { session, saveSession, clearSession, isSessionValid } = useSession();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoggingOut || hasInitialized.current) return;

    const initializeUser = async () => {
      try {
        // Verifica se existe uma sessão no localStorage
        const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
        
        // Se existe sessão mas está expirada, força logout e redireciona
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession.expiresAt && parsedSession.expiresAt < Date.now()) {
            clearSession();
            setUser(null);
            setLoading(false);
            hasInitialized.current = true;
            
            // Redireciona para login imediatamente
            if (typeof window !== 'undefined') {
              window.location.href = "/sign-in";
            }
            return;
          }
        }

        if (session && isSessionValid()) {
          setUser(session.user);
          setLoading(false);
          hasInitialized.current = true;
          return;
        }

        const response = await fetch("/api/auth/get-token");
        if (response.ok) {
          const userData = await UserService.getMe();
          const newUser = userData.data;
          setUser(newUser);
          
          if (session?.accessToken) {
            const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
            saveSession(session.accessToken, newUser, expiresAt);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar usuário:', error);
        if (session && isSessionValid()) {
          setUser(session.user);
        }
      } finally {
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    initializeUser();
  }, [isLoggingOut, session, isSessionValid, saveSession, clearSession]);

  useEffect(() => {
    if (isLoggingOut) {
      hasInitialized.current = false;
    }
  }, [isLoggingOut]);

  // Monitora se a sessão expirou e força logout
  useEffect(() => {
    if (!user || isLoggingOut) return;

    const checkSessionExpiry = () => {
      const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession.expiresAt && parsedSession.expiresAt < Date.now()) {
            // Sessão expirou - força logout sem chamar o endpoint
            clearSession();
            setUser(null);
            window.location.href = "/sign-in";
          }
        } catch (error) {
          console.error('Erro ao verificar expiração da sessão:', error);
        }
      }
    };

    // Verifica imediatamente
    checkSessionExpiry();

    // Verifica a cada 10 segundos
    const interval = setInterval(checkSessionExpiry, 10000);

    return () => clearInterval(interval);
  }, [user, isLoggingOut, clearSession]);

  const logout = async () => {
    setIsLoggingOut(true);
    clearTokenCache();
    clearSession();
    setUser(null);
    hasInitialized.current = false;
    
    try {
      await fetch("/api/auth/sign-out");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    
    window.location.href = "/sign-in";
  };
  
  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
} 