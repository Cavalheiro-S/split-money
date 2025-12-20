import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getSession,
  setSession,
  clearSession,
  isSessionValid,
  shouldRefreshSession,
  getTimeUntilExpiry,
  getTimeUntilRefresh,
  type SessionData
} from '@/utils/session';
import { STORAGE_KEYS } from '@/consts/storage';

describe('utils/session', () => {
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
      writable: true
    });

    // Limpa store antes de cada teste
    mockLocalStorage.clear();

    // Mock console.error para não poluir output dos testes
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('deve retornar null quando não há sessão armazenada', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('deve retornar a sessão armazenada quando existe', () => {
      const mockSession: SessionData = {
        accessToken: 'token123',
        user: { id: '1', email: 'test@test.com', name: 'Test User', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000 // 1 hora no futuro
      };

      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('deve retornar null quando localStorage contém JSON inválido', () => {
      mockLocalStorage.setItem(STORAGE_KEYS.SESSION, 'invalid-json{');

      const session = getSession();
      expect(session).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('deve retornar null quando localStorage lança erro', () => {
      vi.spyOn(mockLocalStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const session = getSession();
      expect(session).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('setSession', () => {
    it('deve armazenar a sessão no localStorage', () => {
      const mockSession: SessionData = {
        accessToken: 'token456',
        user: { id: '2', email: 'user@test.com', name: 'User Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 7200000 // 2 horas no futuro
      };

      setSession(mockSession);

      const stored = mockLocalStorage.getItem(STORAGE_KEYS.SESSION);
      expect(stored).toBe(JSON.stringify(mockSession));
    });

    it('deve sobrescrever sessão existente', () => {
      const oldSession: SessionData = {
        accessToken: 'old-token',
        user: { id: '1', email: 'old@test.com', name: 'Old', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 1000
      };

      const newSession: SessionData = {
        accessToken: 'new-token',
        user: { id: '2', email: 'new@test.com', name: 'New', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 5000
      };

      setSession(oldSession);
      setSession(newSession);

      const session = getSession();
      expect(session).toEqual(newSession);
      expect(session?.accessToken).toBe('new-token');
    });

    it('deve lidar com erro ao salvar no localStorage', () => {
      vi.spyOn(mockLocalStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const mockSession: SessionData = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 1000
      };

      // Não deve lançar erro
      expect(() => setSession(mockSession)).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('deve remover a sessão do localStorage', () => {
      const mockSession: SessionData = {
        accessToken: 'token789',
        user: { id: '3', email: 'clear@test.com', name: 'Clear Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 1000
      };

      setSession(mockSession);
      expect(getSession()).not.toBeNull();

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('deve lidar com erro ao remover do localStorage', () => {
      vi.spyOn(mockLocalStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Cannot remove item');
      });

      // Não deve lançar erro
      expect(() => clearSession()).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });

    it('não deve gerar erro quando chamado sem sessão existente', () => {
      expect(() => clearSession()).not.toThrow();
    });
  });

  describe('isSessionValid', () => {
    it('deve retornar false para sessão null', () => {
      expect(isSessionValid(null)).toBe(false);
    });

    it('deve retornar true para sessão com expiração futura', () => {
      const validSession: SessionData = {
        accessToken: 'valid-token',
        user: { id: '1', email: 'valid@test.com', name: 'Valid', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 3600000 // 1 hora no futuro
      };

      expect(isSessionValid(validSession)).toBe(true);
    });

    it('deve retornar false para sessão expirada', () => {
      const expiredSession: SessionData = {
        accessToken: 'expired-token',
        user: { id: '2', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000 // 1 segundo no passado
      };

      expect(isSessionValid(expiredSession)).toBe(false);
    });

    it('deve retornar false para sessão que expira exatamente agora', () => {
      const now = Date.now();
      const expiringNowSession: SessionData = {
        accessToken: 'expiring-token',
        user: { id: '3', email: 'expiring@test.com', name: 'Expiring', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: now
      };

      // Pequeno delay para garantir que o tempo passou
      expect(isSessionValid(expiringNowSession)).toBe(false);
    });
  });

  describe('shouldRefreshSession', () => {
    it('deve retornar false para sessão null', () => {
      expect(shouldRefreshSession(null)).toBe(false);
    });

    it('deve retornar true quando faltam menos de 5 minutos para expirar', () => {
      const soonToExpireSession: SessionData = {
        accessToken: 'soon-to-expire',
        user: { id: '1', email: 'refresh@test.com', name: 'Refresh', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 4 * 60 * 1000 // 4 minutos no futuro
      };

      expect(shouldRefreshSession(soonToExpireSession)).toBe(true);
    });

    it('deve retornar false quando faltam mais de 5 minutos para expirar', () => {
      const notYetRefreshSession: SessionData = {
        accessToken: 'not-yet-refresh',
        user: { id: '2', email: 'norefresh@test.com', name: 'No Refresh', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutos no futuro
      };

      expect(shouldRefreshSession(notYetRefreshSession)).toBe(false);
    });

    it('deve retornar true quando a sessão já expirou', () => {
      const expiredSession: SessionData = {
        accessToken: 'expired',
        user: { id: '3', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000 // já expirou
      };

      expect(shouldRefreshSession(expiredSession)).toBe(true);
    });

    it('deve retornar true exatamente no threshold de 5 minutos', () => {
      const exactThresholdSession: SessionData = {
        accessToken: 'threshold',
        user: { id: '4', email: 'threshold@test.com', name: 'Threshold', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 5 * 60 * 1000 // exatamente 5 minutos
      };

      expect(shouldRefreshSession(exactThresholdSession)).toBe(true);
    });
  });

  describe('getTimeUntilExpiry', () => {
    it('deve retornar 0 para sessão null', () => {
      expect(getTimeUntilExpiry(null)).toBe(0);
    });

    it('deve retornar tempo correto até a expiração', () => {
      const futureTime = 10 * 60 * 1000; // 10 minutos
      const session: SessionData = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + futureTime
      };

      const timeUntilExpiry = getTimeUntilExpiry(session);
      // Permitir pequena margem de erro devido ao tempo de execução
      expect(timeUntilExpiry).toBeGreaterThan(futureTime - 100);
      expect(timeUntilExpiry).toBeLessThanOrEqual(futureTime);
    });

    it('deve retornar 0 para sessão expirada', () => {
      const expiredSession: SessionData = {
        accessToken: 'expired',
        user: { id: '2', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000
      };

      expect(getTimeUntilExpiry(expiredSession)).toBe(0);
    });
  });

  describe('getTimeUntilRefresh', () => {
    it('deve retornar 0 para sessão null', () => {
      expect(getTimeUntilRefresh(null)).toBe(0);
    });

    it('deve retornar tempo correto até o refresh (expiração - 5min)', () => {
      const futureTime = 10 * 60 * 1000; // 10 minutos
      const session: SessionData = {
        accessToken: 'token',
        user: { id: '1', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + futureTime
      };

      const timeUntilRefresh = getTimeUntilRefresh(session);
      const expectedTime = futureTime - 5 * 60 * 1000; // 5 minutos

      // Permitir margem de erro
      expect(timeUntilRefresh).toBeGreaterThan(expectedTime - 100);
      expect(timeUntilRefresh).toBeLessThanOrEqual(expectedTime);
    });

    it('deve retornar 0 quando já passou do threshold de refresh', () => {
      const session: SessionData = {
        accessToken: 'token',
        user: { id: '2', email: 'test@test.com', name: 'Test', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 2 * 60 * 1000 // 2 minutos (menos que os 5min threshold)
      };

      expect(getTimeUntilRefresh(session)).toBe(0);
    });

    it('deve retornar 0 para sessão expirada', () => {
      const expiredSession: SessionData = {
        accessToken: 'expired',
        user: { id: '3', email: 'expired@test.com', name: 'Expired', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() - 1000
      };

      expect(getTimeUntilRefresh(expiredSession)).toBe(0);
    });
  });

  describe('Integração: Fluxo completo de sessão', () => {
    it('deve criar, validar, e remover uma sessão completa', () => {
      // 1. Inicialmente não há sessão
      expect(getSession()).toBeNull();

      // 2. Cria uma nova sessão
      const newSession: SessionData = {
        accessToken: 'integration-token',
        user: {
          id: 'user-123',
          email: 'integration@test.com',
          name: 'Integration Test',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutos
      };

      setSession(newSession);

      // 3. Valida que a sessão foi salva
      const storedSession = getSession();
      expect(storedSession).toEqual(newSession);
      expect(isSessionValid(storedSession)).toBe(true);

      // 4. Verifica que não precisa refresh ainda
      expect(shouldRefreshSession(storedSession)).toBe(false);

      // 5. Limpa a sessão
      clearSession();
      expect(getSession()).toBeNull();
    });

    it('deve identificar corretamente sessão próxima do refresh', () => {
      const sessionNearRefresh: SessionData = {
        accessToken: 'near-refresh-token',
        user: { id: 'user-456', email: 'near@test.com', name: 'Near Refresh', createdAt: new Date(), updatedAt: new Date() },
        expiresAt: Date.now() + 4 * 60 * 1000 // 4 minutos
      };

      setSession(sessionNearRefresh);

      const stored = getSession();
      expect(isSessionValid(stored)).toBe(true);
      expect(shouldRefreshSession(stored)).toBe(true);
    });
  });
});
