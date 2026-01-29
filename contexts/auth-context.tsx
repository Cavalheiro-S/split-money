"use client";

import { AuthService } from "@/services/auth.service";
import { clearAuthTokens, setAuthTokens } from "@/utils/auth";
import { AuthSession, AuthUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

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

// Type guard for auth errors
interface AuthError {
  name: string;
  message?: string;
}

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as AuthError).name === "string"
  );
}

function isUserUnAuthenticatedError(error: unknown): boolean {
  return isAuthError(error) && error.name === "UserUnAuthenticatedException";
}

// Helper to check if session has valid tokens
function hasValidTokens(session: AuthSession | null): boolean {
  return Boolean(session?.tokens?.accessToken && session?.tokens?.idToken);
}

// Helper to persist tokens from session
async function persistSessionTokens(session: AuthSession): Promise<void> {
  if (!session.tokens?.idToken || !session.tokens?.accessToken) {
    throw new Error("Session tokens are missing");
  }
  await setAuthTokens(
    session.tokens.idToken.toString(),
    session.tokens.accessToken.toString()
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Centralized function to clear auth state
  const clearAuthState = useCallback(async () => {
    await clearAuthTokens();
    setIsAuthenticated(false);
  }, []);

  // Validate session from Amplify and persist tokens
  const validateAndPersistSession = useCallback(async (): Promise<boolean> => {
    const session = await AuthService.getAuthSession();

    if (!hasValidTokens(session)) {
      return false;
    }

    const currentUser = await AuthService.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    await persistSessionTokens(session!);
    return true;
  }, []);

  // Try to restore session from cookies first, then fall back to Amplify
  const syncSession = useCallback(async () => {
    try {
      setIsInitializing(true);

      // First, try to validate existing cookie token
      const tokenResponse = await fetch("/api/auth/get-token");

      if (tokenResponse.ok) {
        const { accessToken } = await tokenResponse.json();

        if (accessToken) {
          // Cookie has token, validate with Amplify session
          const session = await AuthService.getAuthSession();

          if (hasValidTokens(session)) {
            const currentUser = await AuthService.getCurrentUser();
            if (currentUser) {
              setIsAuthenticated(true);
              return;
            }
          }

          // Cookie exists but Amplify session is invalid - still consider authenticated
          // This handles cases where Amplify session expired but cookie is still valid
          setIsAuthenticated(true);
          return;
        }
      }

      // No valid cookie token, try to establish session from Amplify
      const isValid = await validateAndPersistSession();

      if (isValid) {
        setIsAuthenticated(true);
        return;
      }

      // No valid session found
      await clearAuthState();
    } catch (error) {
      // Only log unexpected errors, not normal unauthenticated state
      if (!isUserUnAuthenticatedError(error)) {
        console.error("Failed to sync session:", error);
      }
      await clearAuthState();
    } finally {
      setIsInitializing(false);
    }
  }, [clearAuthState, validateAndPersistSession]);

  useEffect(() => {
    syncSession();

    const unsubscribe = Hub.listen("auth", async ({ payload: { event } }) => {
      switch (event) {
        case "signedIn":
        case "tokenRefresh":
          await syncSession();
          break;
        case "signedOut":
          await clearAuthState();
          break;
      }
    });

    return unsubscribe;
  }, [syncSession, clearAuthState]);

  const login = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const user = await AuthService.getCurrentUser();
      const session = await AuthService.getAuthSession();

      if (!hasValidTokens(session)) {
        setIsAuthenticated(false);
        return null;
      }

      await persistSessionTokens(session!);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error("Sign out request failed:", error);
      // Continue with local cleanup even if remote sign out fails
    } finally {
      await clearAuthState();
      router.replace("/sign-in");
    }
  }, [clearAuthState, router]);

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
