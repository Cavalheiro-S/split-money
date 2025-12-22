"use client";

import { AuthService } from "@/services/auth.service";
import { clearAuthTokens, setAuthTokens } from "@/utils/auth";
import { AuthUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { createContext, ReactNode, useContext, useEffect } from "react";

export interface SessionData {
  accessToken: string;
  user: User;
  expiresAt: number;
}

export interface AuthContextType {
  login: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    async function syncSession() {
      try {
        const token = await AuthService.getToken();

        if (token) {
          const session = await AuthService.getAuthSession();

          if (session?.tokens?.accessToken) {
            await setAuthTokens(
              session.tokens.idToken?.toString() || "",
              session.tokens.accessToken?.toString() || ""
            );
          }
        }
      } catch (error) {
        console.error("Erro ao sincronizar sessão:", error);
      }
    }

    syncSession();

    const unsubscribe = Hub.listen("auth", async (data) => {
      console.log("Auth event:", data);

      if (data.payload.event === "signedIn") {
        await syncSession();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async () => {
    const user = await AuthService.getCurrentUser();
    const session = await AuthService.getAuthSession();
    await setAuthTokens(
      session?.tokens?.idToken?.toString() || "",
      session?.tokens?.accessToken?.toString() || ""
    );

    return user;
  };
  const logout = async () => {
    await AuthService.signOut();
    await clearAuthTokens();
    window.location.href = "/sign-in";
  };

  const value: AuthContextType = {
    login,
    logout,
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
