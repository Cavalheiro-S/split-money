'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserService } from '@/services/user.service';
import { clearTokenCache } from '@/utils/data';

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

  useEffect(() => {
    if (isLoggingOut) return;

    const initializeUser = async () => {
      try {
        const response = await fetch("/api/auth/get-token");
        if (response.ok) {
          const userData = await UserService.getMe();
          setUser(userData.data);
        }
      } catch (error) {
        console.error('Erro ao inicializar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [isLoggingOut]);

  const logout = async () => {
    setIsLoggingOut(true);
    clearTokenCache();
    setUser(null);
    
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