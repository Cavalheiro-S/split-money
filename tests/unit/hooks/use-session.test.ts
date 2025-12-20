import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSession } from '@/hooks/use-session';
import type { SessionData } from '@/utils/session';
import { STORAGE_KEYS } from '@/consts/storage';

describe('hooks/useSession', () => {
  // Mock localStorage
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  })();

  beforeEach(() => {
    // Substitui localStorage global
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });

    // Limpa store antes de cada teste
    mockLocalStorage.clear();

    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Inicialização', () => {
    it('deve iniciar com session null quando não há sessão armazenada', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).toBeNull();
    });

    it('deve carregar sessão válida do localStorage na inicialização', async () => {
      const mockSession: SessionData = {
        accessToken: 'valid-token',
        user: { id: '1', email: 'test@test.com', name: 'Test User', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000 // 1 hora no futuro
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).toEqual(mockSession);
    });

    it('deve limpar sessão expirada na inicialização', async () => {
      const expiredSession: SessionData = {
        accessToken: 'expired-token',
        user: { id: '2', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000 // já expirou
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(expiredSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(mockLocalStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull();
    });

    it('deve lidar com JSON inválido no localStorage', async () => {
      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, 'invalid-json{');

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('deve setar isLoading como true inicialmente e false após carregar', async () => {
      const { result } = renderHook(() => useSession());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('saveSession', () => {
    it('deve salvar nova sessão no estado e localStorage', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newSession = {
        accessToken: 'new-token',
        user: { id: 'user-1', email: 'new@test.com', name: 'New User', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      act(() => {
        result.current.saveSession(
          newSession.accessToken,
          newSession.user,
          newSession.expiresAt
        );
      });

      expect(result.current.session).toEqual(newSession);

      const stored = mockLocalStorage.getItem(STORAGE_KEYS.SESSION);
      expect(stored).toBe(JSON.stringify(newSession));
    });

    it('deve sobrescrever sessão existente', async () => {
      const oldSession: SessionData = {
        accessToken: 'old-token',
        user: { id: 'old-user', email: 'old@test.com', name: 'Old', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 1000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(oldSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const newSession = {
        accessToken: 'new-token',
        user: { id: 'new-user', email: 'new@test.com', name: 'New', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 5000
      };

      act(() => {
        result.current.saveSession(
          newSession.accessToken,
          newSession.user,
          newSession.expiresAt
        );
      });

      expect(result.current.session?.accessToken).toBe('new-token');
      expect(result.current.session?.user.id).toBe('new-user');
    });

    it('deve lidar com erro ao salvar no localStorage', async () => {
      vi.spyOn(mockLocalStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Não deve lançar erro
      act(() => {
        result.current.saveSession('token', { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() }, Date.now() + 1000);
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('deve limpar sessão do estado e localStorage', async () => {
      const mockSession: SessionData = {
        accessToken: 'token-to-clear',
        user: { id: '1', email: 'clear@test.com', name: 'Clear', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).not.toBeNull();

      act(() => {
        result.current.clearSession();
      });

      expect(result.current.session).toBeNull();
      expect(mockLocalStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull();
    });

    it('não deve lançar erro quando chamado sem sessão existente', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(() => {
        act(() => {
          result.current.clearSession();
        });
      }).not.toThrow();
    });

    it('deve lidar com erro ao remover do localStorage', async () => {
      const mockSession: SessionData = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));

      vi.spyOn(mockLocalStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Cannot remove');
      });

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.clearSession();
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('isSessionValid', () => {
    it('deve retornar true para sessão válida', async () => {
      const validSession: SessionData = {
        accessToken: 'valid-token',
        user: { id: '1', email: 'valid@test.com', name: 'Valid', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(validSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSessionValid()).toBe(true);
    });

    it('deve retornar false para sessão expirada', async () => {
      const expiredSession: SessionData = {
        accessToken: 'expired-token',
        user: { id: '2', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000
      };

        mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(expiredSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Sessão expirada é limpa automaticamente
      expect(result.current.session).toBeNull();
      expect(result.current.isSessionValid()).toBe(false);
    });

    it('deve retornar false quando não há sessão', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSessionValid()).toBe(false);
    });
  });

  describe('loadSession', () => {
    it('deve recarregar sessão do localStorage', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).toBeNull();

      // Adiciona sessão manualmente no localStorage
      const newSession: SessionData = {
        accessToken: 'reloaded-token',
        user: { id: '1', email: 'reload@test.com', name: 'Reload', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newSession));

      // Recarrega sessão
      act(() => {
        result.current.loadSession();
      });

      expect(result.current.session).toEqual(newSession);
    });

    it('deve limpar sessão inválida ao recarregar', async () => {
      const validSession: SessionData = {
        accessToken: 'valid',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(validSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.session).not.toBeNull();

      // Substitui por sessão expirada
      const expiredSession: SessionData = {
        accessToken: 'expired',
        user: { id: '2', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(expiredSession));

      act(() => {
        result.current.loadSession();
      });

      expect(result.current.session).toBeNull();
    });
  });

  describe('Fluxo completo de autenticação', () => {
    it('deve simular login, validação e logout completo', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 1. Inicialmente sem sessão
      expect(result.current.session).toBeNull();
      expect(result.current.isSessionValid()).toBe(false);

      // 2. Simula login (salva sessão)
      const userSession = {
        accessToken: 'auth-token-123',
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutos
      };

      act(() => {
        result.current.saveSession(
          userSession.accessToken,
          userSession.user,
          userSession.expiresAt
        );
      });

      // 3. Valida que usuário está autenticado
      expect(result.current.session).toEqual(userSession);
      expect(result.current.isSessionValid()).toBe(true);

      // 4. Simula logout
      act(() => {
        result.current.clearSession();
      });

      // 5. Valida que sessão foi limpa
      expect(result.current.session).toBeNull();
      expect(result.current.isSessionValid()).toBe(false);
    });

    it('deve manter sessão entre remontagens do componente', async () => {
      const mockSession: SessionData = {
        accessToken: 'persistent-token',
        user: { id: '1', email: 'persistent@test.com', name: 'Persistent', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      // Primeiro render
      const { result: result1, unmount } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result1.current.isLoading).toBe(false);
      });

      act(() => {
        result1.current.saveSession(
          mockSession.accessToken,
          mockSession.user,
          mockSession.expiresAt
        );
      });

      expect(result1.current.session).toEqual(mockSession);

      // Desmonta componente
      unmount();

      // Segundo render (simula remontagem)
      const { result: result2 } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      });

      // Sessão deve persistir
      expect(result2.current.session).toEqual(mockSession);
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com múltiplas chamadas de saveSession em sequência', async () => {
      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.saveSession('token1', { id: '1', email: 'user1@test.com', name: 'User1', createdAt: new Date(), updatedAt: new Date() }, Date.now() + 1000);
        result.current.saveSession('token2', { id: '2', email: 'user2@test.com', name: 'User2', createdAt: new Date(), updatedAt: new Date() }, Date.now() + 2000);
        result.current.saveSession('token3', { id: '3', email: 'user3@test.com', name: 'User3', createdAt: new Date(), updatedAt: new Date() }, Date.now() + 3000);
      });

      // Deve manter apenas a última sessão
      expect(result.current.session?.user.id).toBe('3');
    });

    it('deve lidar com clearSession chamado múltiplas vezes', async () => {
      const mockSession: SessionData = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));

      const { result } = renderHook(() => useSession());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.clearSession();
        result.current.clearSession();
        result.current.clearSession();
      });

      expect(result.current.session).toBeNull();
    });

    it('deve carregar sessão apenas uma vez na inicialização', async () => {
      const mockSession: SessionData = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));

      const getItemSpy = vi.spyOn(mockLocalStorage, 'getItem');

      renderHook(() => useSession());

      await waitFor(() => {
        // getItem deve ser chamado apenas uma vez durante inicialização
        expect(getItemSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
