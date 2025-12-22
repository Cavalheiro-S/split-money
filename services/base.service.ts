import { DELETE_CONFLICT_MESSAGES } from "@/enums/exceptions/delete-conflicts";
import { ApiConflictError, ApiErrorResponse } from "@/lib/errors";
import { fetchWithAuth } from "@/utils/data";
import { globalRateLimiter } from "@/lib/rate-limiter";

export class ApiService {
  protected static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    // Verifica rate limit
    if (!globalRateLimiter.canMakeRequest(endpoint)) {
      const timeUntilReset = globalRateLimiter.getTimeUntilReset(endpoint);
      const secondsUntilReset = Math.ceil(timeUntilReset / 1000);
      throw new Error(
        `Muitas requisições. Aguarde ${secondsUntilReset} segundos e tente novamente.`
      );
    }

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        options
      );

      if (!response?.ok && response) {
        const errorData: ApiErrorResponse = await response.json();

        // Se é um erro 409 com código específico, usar mensagem personalizada
        if (
          response.status === 409 &&
          errorData.code &&
          errorData.code in DELETE_CONFLICT_MESSAGES
        ) {
          const userMessage = DELETE_CONFLICT_MESSAGES[errorData.code];
          throw new ApiConflictError(
            errorData.code,
            userMessage,
            errorData.message
          );
        }

        throw new Error(errorData.message || "Erro ao conectar com a API");
      }

      return response?.json();
    } catch (error) {
      // Se já é um ApiConflictError, repassar
      if (error instanceof ApiConflictError) {
        throw error;
      }

      console.error("API Error:", error);
      throw new Error("Falha na comunicação com o servidor. Tente novamente.");
    }
  }

  protected static async requestWithoutAuth<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, options);
    if (!response?.ok && response) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.message || "Erro ao conectar com a API");
    }
    return response?.json();
  }
}
