"use client";

import { AuthService } from "@/services/auth.service";
import { clearAuthTokens, setAuthTokens } from "@/utils/auth";
import { AuthUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface SessionData {
  accessToken: string;
  user: User;
  expiresAt: number;
}

export interface AuthContextType {
  login: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  isInitializing: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function syncSession() {
      try {
        setIsInitializing(true);
        
        try {
          const response = await fetch("/api/auth/get-token");
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.accessToken) {
              const session = await AuthService.getAuthSession();
              
              if (session?.tokens?.accessToken && session?.tokens?.idToken) {
                const currentUser = await AuthService.getCurrentUser();
                if (currentUser) {
                  setIsAuthenticated(true);
                  return;
                }
              } else {
                setIsAuthenticated(true);
                return;
              }
            }
          } else {
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
        
        const session = await AuthService.getAuthSession();
        
        if (session?.tokens?.accessToken && session?.tokens?.idToken) {
          const currentUser = await AuthService.getCurrentUser();
          
          if (currentUser) {
            await setAuthTokens(
              session.tokens.idToken.toString(),
              session.tokens.accessToken.toString()
            );
            setIsAuthenticated(true);
          } else {
            await clearAuthTokens();
            setIsAuthenticated(false);
          }
        } else {
          await clearAuthTokens();
          setIsAuthenticated(false);
        }
      } catch (error) {
        const errorObj = error as { name?: string };
        if (errorObj?.name !== "UserUnAuthenticatedException") {
          console.error("Erro ao sincronizar sessão:", error);
        }
        await clearAuthTokens();
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    }

    syncSession();

    const unsubscribe = Hub.listen("auth", async (data) => {
      const { event } = data.payload;
      
      if (event === "signedIn") {
        await syncSession();
      } else if (event === "signedOut") {
        await clearAuthTokens();
        setIsAuthenticated(false);
      } else if (event === "tokenRefresh") {
        await syncSession();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      const session = await AuthService.getAuthSession();
      
      if (session?.tokens?.idToken && session?.tokens?.accessToken) {
        await setAuthTokens(
          session.tokens.idToken.toString(),
          session.tokens.accessToken.toString()
        );
        setIsAuthenticated(true);
      }

      return user;
    } catch (error) {
      console.error("Erro no login:", error);
      setIsAuthenticated(false);
      return null;
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
      await clearAuthTokens();
      setIsAuthenticated(false);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Erro no logout:", error);
      await clearAuthTokens();
      setIsAuthenticated(false);
      router.replace("/sign-in");
    }
  };

  const value: AuthContextType = {
    login,
    logout,
    isInitializing,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
