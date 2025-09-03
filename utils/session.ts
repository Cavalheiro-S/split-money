const SESSION_KEY = 'split-money-session';
const SESSION_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutos antes da expiração

export interface SessionData {
  accessToken: string;
  user: any;
  expiresAt: number;
}

export function getSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const sessionData: SessionData = JSON.parse(stored);
    return sessionData;
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
}

export function setSession(sessionData: SessionData): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Erro ao salvar sessão:', error);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Erro ao limpar sessão:', error);
  }
}

export function isSessionValid(session: SessionData | null): boolean {
  if (!session) return false;
  return session.expiresAt > Date.now();
}

export function shouldRefreshSession(session: SessionData | null): boolean {
  if (!session) return false;
  return session.expiresAt - Date.now() <= SESSION_REFRESH_THRESHOLD;
}

export function getTimeUntilExpiry(session: SessionData | null): number {
  if (!session) return 0;
  return Math.max(0, session.expiresAt - Date.now());
}

export function getTimeUntilRefresh(session: SessionData | null): number {
  if (!session) return 0;
  return Math.max(0, session.expiresAt - Date.now() - SESSION_REFRESH_THRESHOLD);
}
