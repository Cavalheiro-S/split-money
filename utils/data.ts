import { STORAGE_KEYS } from "@/consts/storage";
import { AuthService } from "@/services/auth.service";

let tokenCache: string | null = null;
let tokenPromise: Promise<string> | null = null;
let lastTokenCheck = 0;
const TOKEN_CHECK_INTERVAL = 60000;

async function getToken(): Promise<string> {
  const now = Date.now();
  
  if (tokenCache && (now - lastTokenCheck) < TOKEN_CHECK_INTERVAL) {
    return tokenCache;
  }

  if (tokenPromise) {
    return tokenPromise;
  }

  try {
    const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.expiresAt > now) {
        tokenCache = session.accessToken;
        lastTokenCheck = now;
        return session.accessToken;
      }
    }
  } catch (error) {
    console.error('Erro ao verificar sessão persistente:', error);
  }

  tokenPromise = fetch("/api/auth/get-token")
    .then(async (response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      const { accessToken } = await response.json();
      if (!accessToken) {
        throw new Error('No token received');
      }
      tokenCache = accessToken;
      lastTokenCheck = now;
      return accessToken;
    })
    .finally(() => {
      tokenPromise = null;
    });

  return tokenPromise;
}

export function clearTokenCache() {
  tokenCache = null;
  tokenPromise = null;
  lastTokenCheck = 0;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.error('Erro ao limpar sessão persistente:', error);
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const accessToken = await AuthService.getToken();

    const apiResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (apiResponse.status === 401 && tokenCache) {
      console.log('Token expirado, limpando cache e tentando novamente...');
      clearTokenCache();
      
      try {
        const newToken = await getToken();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (retryError) {
        console.error('Falha ao renovar token:', retryError);
        window.location.href = "/sign-in";
        return;
      }
    }

    if (apiResponse.status === 401) {
      window.location.href = "/sign-in";
      return;
    }

    return apiResponse;
  } catch (error) {
    console.error("Erro ao buscar token:", error);
    clearTokenCache();
    window.location.href = "/sign-in";
  }
}
