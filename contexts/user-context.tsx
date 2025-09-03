'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { UserService } from '@/services/user.service';
import { clearTokenCache } from '@/utils/data';
import { useSession } from '@/hooks/use-session';

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
  const { session, saveSession, clearSession, isSessionValid, loadSession } = useSession();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isLoggingOut || hasInitialized.current) return;

    const initializeUser = async () => {
      try {
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
  }, [isLoggingOut, session, isSessionValid, saveSession]);

  useEffect(() => {
    if (isLoggingOut) {
      hasInitialized.current = false;
    }
  }, [isLoggingOut]);

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