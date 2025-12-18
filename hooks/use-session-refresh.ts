"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "@/hooks/use-session";
import { useUser } from "@/contexts/user-context";
import { shouldRefreshSession, getTimeUntilRefresh } from "@/utils/session";
import { useErrorLogger } from "@/lib/error-logger";

interface SessionRefreshConfig {
  maxRetries: number;
  initialRetryDelay: number;
  maxRetryDelay: number;
}

const DEFAULT_CONFIG: SessionRefreshConfig = {
  maxRetries: 3,
  initialRetryDelay: 1000,
  maxRetryDelay: 10000,
};

export function useSessionRefresh(config: Partial<SessionRefreshConfig> = {}) {
  const { session, isSessionValid, clearSession } = useSession();
  const { user } = useUser();
  const { logAuthError } = useErrorLogger();

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const refreshSession = useCallback(
    async (retryCount = 0) => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      try {
        const response = await fetch("/api/auth/get-token", {
          method: "POST", // Geralmente refresh é POST, mas vou manter se for GET na API
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to refresh token: ${response.status}`);
        }

        const data = await response.json();
        if (data.accessToken && user) {
          // Token atualizado com sucesso (lógica de estado deve estar no provider/hook useSession se ele observar cookies)
          // Se useSession lê do cookie/storage, ele vai atualizar no próximo render ou listener
          if (process.env.NODE_ENV === "development") {
            console.debug("Token session refreshed successfully");
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        if (retryCount < finalConfig.maxRetries) {
          const delay = Math.min(
            finalConfig.initialRetryDelay * Math.pow(2, retryCount),
            finalConfig.maxRetryDelay
          );

          console.warn(
            `Token refresh failed, retrying in ${delay}ms (Attempt ${
              retryCount + 1
            }/${finalConfig.maxRetries})`
          );

          retryTimeoutRef.current = setTimeout(() => {
            isRefreshingRef.current = false;
            refreshSession(retryCount + 1);
          }, delay);

          return; // Retornar para não resetar flag isRefreshing
        } else {
          await logAuthError(err);
          // Só faz logout se realmente falhar todas as tentativas e o token estiver expirado/próximo
          // Mas talvez seja drástico deslogar só por falha de network temporária.
          // Vou manter o comportamento original de limpar sessão APENAS se o token já não for mais válido.
          if (!isSessionValid()) {
            clearSession();
          }
        }
      } finally {
        if (!retryTimeoutRef.current) {
          isRefreshingRef.current = false;
        }
      }
    },
    [user, finalConfig, logAuthError, isSessionValid, clearSession]
  );

  // Efeito principal de agendamento
  useEffect(() => {
    if (!session || !isSessionValid()) {
      return;
    }

    const scheduleRefresh = () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

      if (shouldRefreshSession(session)) {
        refreshSession();
      } else {
        const timeUntilRefresh = getTimeUntilRefresh(session);
        if (timeUntilRefresh > 0) {
          refreshTimeoutRef.current = setTimeout(() => {
            refreshSession();
          }, timeUntilRefresh);
        }
      }
    };

    scheduleRefresh();

    // Re-schedule on focus (opcional, bom para quando usuário volta para aba)
    const onFocus = () => {
      // Se voltamos para a aba e já passou o tempo, refresh imediato
      if (shouldRefreshSession(session)) {
        refreshSession();
      }
    };

    window.addEventListener("focus", onFocus);

    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      window.removeEventListener("focus", onFocus);
    };
  }, [session, isSessionValid, refreshSession]);

  return null;
}
