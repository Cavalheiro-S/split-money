import { useSessionRefresh } from "@/hooks/use-session-refresh";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock dos hooks e contextos
const mockSession = vi.fn();
const mockIsSessionValid = vi.fn();
const mockClearSession = vi.fn();
const mockUser = vi.fn();
const mockLogAuthError = vi.fn();

vi.mock("@/hooks/use-session", () => ({
  useSession: () => ({
    session: mockSession(),
    isSessionValid: mockIsSessionValid,
    clearSession: mockClearSession,
  }),
}));

vi.mock("@/contexts/user-context", () => ({
  useUser: () => ({
    user: mockUser(),
  }),
}));

vi.mock("@/lib/error-logger", () => ({
  useErrorLogger: () => ({
    logAuthError: mockLogAuthError,
  }),
}));

describe("hooks/useSessionRefresh", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    // Mock global fetch
    global.fetch = mockFetch;

    // Mock console
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "debug").mockImplementation(() => {});

    // Mock timers
    vi.useFakeTimers();

    // Reset mocks
    mockFetch.mockReset();
    mockSession.mockReturnValue(null);
    mockIsSessionValid.mockReturnValue(false);
    mockClearSession.mockClear();
    mockUser.mockReturnValue(null);
    mockLogAuthError.mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("Inicialização", () => {
    it("não deve fazer nada quando não há sessão", () => {
      mockSession.mockReturnValue(null);
      mockIsSessionValid.mockReturnValue(false);

      renderHook(() => useSessionRefresh());

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("não deve fazer nada quando sessão é inválida", () => {
      mockSession.mockReturnValue({
        accessToken: "expired-token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt: Date.now() - 1000,
      });
      mockIsSessionValid.mockReturnValue(false);

      renderHook(() => useSessionRefresh());

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Agendamento de refresh", () => {
    it("deve agendar refresh quando sessão está próxima da expiração", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000; // 4 minutos

      mockSession.mockReturnValue({
        accessToken: "valid-token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      });

      renderHook(() => useSessionRefresh());

      // Deve executar refresh imediatamente pois está próximo da expiração
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/auth/get-token",
          expect.objectContaining({
            method: "POST",
          })
        );
      });
    });

    it("deve agendar refresh para o futuro quando sessão ainda é válida", () => {
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

      mockSession.mockReturnValue({
        accessToken: "valid-token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);

      renderHook(() => useSessionRefresh());

      // Não deve fazer refresh imediatamente
      expect(mockFetch).not.toHaveBeenCalled();

      // Avança para 5 minutos antes da expiração
      vi.advanceTimersByTime(5 * 60 * 1000 + 100);

      // Agora deve ter agendado o refresh
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("Execução de refresh", () => {
    it("deve executar refresh com sucesso", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "old-token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      });

      renderHook(() => useSessionRefresh());

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/auth/get-token",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
        );
      });
    });

    it("deve logar em desenvolvimento quando refresh é bem-sucedido", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      });

      renderHook(() => useSessionRefresh());

      await waitFor(() => {
        expect(console.debug).toHaveBeenCalledWith(
          "Token session refreshed successfully"
        );
      });
    });
  });

  describe("Tratamento de erros", () => {
    it("deve fazer retry quando refresh falha", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      // Primeira tentativa falha
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Segunda tentativa sucesso
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      });

      renderHook(() => useSessionRefresh());

      // Aguarda primeira tentativa
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Avança timer para o primeiro retry (1000ms)
      vi.advanceTimersByTime(1000);

      // Aguarda segunda tentativa
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("Token refresh failed, retrying in")
      );
    });

    it("deve implementar exponential backoff nos retries", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      // Todas as tentativas falham
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      renderHook(() => useSessionRefresh());

      // Primeira tentativa
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Primeiro retry: 1000ms * 2^0 = 1000ms
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      // Segundo retry: 1000ms * 2^1 = 2000ms
      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
      });

      // Terceiro retry: 1000ms * 2^2 = 4000ms
      vi.advanceTimersByTime(4000);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(4);
      });
    });

    it("deve respeitar maxRetryDelay", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      // Config com delay máximo baixo
      renderHook(() =>
        useSessionRefresh({
          maxRetries: 5,
          maxRetryDelay: 3000, // máximo 3 segundos
        })
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Mesmo que exponencial seja maior, deve limitar a 3000ms
      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });

    it("deve limpar sessão após esgotar retries se sessão inválida", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(false); // Sessão inválida
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      renderHook(() => useSessionRefresh({ maxRetries: 2 }));

      // Primeira tentativa
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Retry 1
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      // Retry 2
      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
      });

      // Deve ter logado erro e limpo sessão
      await waitFor(() => {
        expect(mockLogAuthError).toHaveBeenCalled();
        expect(mockClearSession).toHaveBeenCalled();
      });
    });

    it("não deve limpar sessão após retries se sessão ainda válida", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true); // Sessão ainda válida
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      renderHook(() => useSessionRefresh({ maxRetries: 1 }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      // Não deve limpar sessão pois ainda é válida
      expect(mockClearSession).not.toHaveBeenCalled();
    });
  });

  describe("Evento de focus na janela", () => {
    it("deve fazer refresh quando usuário volta para a aba e sessão próxima de expirar", async () => {
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      });

      renderHook(() => useSessionRefresh());

      // Não deve ter chamado ainda
      expect(mockFetch).not.toHaveBeenCalled();

      // Simula passar do tempo e voltar para a aba
      // Atualiza sessão mock para estar próxima da expiração
      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutos
      });

      // Dispara evento de focus
      const focusEvent = new Event("focus");
      window.dispatchEvent(focusEvent);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    });
  });

  describe("Cleanup", () => {
    it("deve limpar timers quando componente desmonta", () => {
      const expiresAt = Date.now() + 10 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);

      const { unmount } = renderHook(() => useSessionRefresh());

      // Desmonta
      unmount();

      // Avança timers
      vi.advanceTimersByTime(10 * 60 * 1000);

      // Não deve ter executado refresh após desmontar
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("deve remover event listener de focus quando desmonta", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const expiresAt = Date.now() + 10 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);

      const { unmount } = renderHook(() => useSessionRefresh());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "focus",
        expect.any(Function)
      );
    });
  });

  describe("Configuração customizada", () => {
    it("deve aceitar configuração customizada de retries", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      renderHook(() =>
        useSessionRefresh({
          maxRetries: 5,
          initialRetryDelay: 500,
          maxRetryDelay: 5000,
        })
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Primeiro retry com delay customizado de 500ms
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Prevenção de refresh concorrente", () => {
    it("não deve permitir múltiplas execuções simultâneas de refresh", async () => {
      const expiresAt = Date.now() + 4 * 60 * 1000;

      mockSession.mockReturnValue({
        accessToken: "token",
        user: { id: "1", email: "test@test.com", name: "Test" },
        expiresAt,
      });
      mockIsSessionValid.mockReturnValue(true);
      mockUser.mockReturnValue({
        id: "1",
        email: "test@test.com",
        name: "Test",
      });

      let resolveFirstFetch: (value: unknown) => void;
      const firstFetchPromise = new Promise((resolve) => {
        resolveFirstFetch = resolve;
      });

      mockFetch.mockImplementationOnce(() => firstFetchPromise);

      renderHook(() => useSessionRefresh());

      // Aguarda primeira chamada iniciar
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      // Dispara evento de focus enquanto refresh está em andamento
      const focusEvent = new Event("focus");
      window.dispatchEvent(focusEvent);

      // Aguarda um pouco
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Não deve ter feito segunda chamada
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Resolve primeira chamada
      resolveFirstFetch!({
        ok: true,
        json: async () => ({ accessToken: "new-token" }),
      });
    });
  });
});
