"use client";

import { useCallback } from "react";
import { useErrorLogger } from "@/lib/error-logger";
import { toast } from "sonner";

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const { logUIError, logAPIError, logAuthError, logDataError, logNetworkError } = useErrorLogger();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = "Ocorreu um erro inesperado",
      } = options;

      const normalizedError = error instanceof Error ? error : new Error(String(error));
      
      if (logError) {
        logUIError(normalizedError);
      }

      if (showToast) {
        toast.error(normalizedError.message || fallbackMessage);
      }
    },
    [logUIError]
  );

  const handleAPIError = useCallback(
    (error: unknown, endpoint?: string, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = "Erro na comunicação com o servidor",
      } = options;

      const normalizedError = error instanceof Error ? error : new Error(String(error));
      
      if (logError) {
        logAPIError(normalizedError, endpoint);
      }

      if (showToast) {
        toast.error(normalizedError.message || fallbackMessage);
      }
    },
    [logAPIError]
  );

  const handleAuthError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = "Erro de autenticação",
      } = options;

      const normalizedError = error instanceof Error ? error : new Error(String(error));
      
      if (logError) {
        logAuthError(normalizedError);
      }

      if (showToast) {
        toast.error(normalizedError.message || fallbackMessage);
      }
    },
    [logAuthError]
  );

  const handleDataError = useCallback(
    (error: unknown, operation?: string, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = "Erro ao processar dados",
      } = options;

      const normalizedError = error instanceof Error ? error : new Error(String(error));
      
      if (logError) {
        logDataError(normalizedError, operation);
      }

      if (showToast) {
        toast.error(normalizedError.message || fallbackMessage);
      }
    },
    [logDataError]
  );

  const handleNetworkError = useCallback(
    (error: unknown, url?: string, options: ErrorHandlerOptions = {}) => {
      const {
        showToast = true,
        logError = true,
        fallbackMessage = "Erro de conexão",
      } = options;

      const normalizedError = error instanceof Error ? error : new Error(String(error));
      
      if (logError) {
        logNetworkError(normalizedError, url);
      }

      if (showToast) {
        toast.error(normalizedError.message || fallbackMessage);
      }
    },
    [logNetworkError]
  );

  return {
    handleError,
    handleAPIError,
    handleAuthError,
    handleDataError,
    handleNetworkError,
  };
};
