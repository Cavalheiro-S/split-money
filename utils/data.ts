let tokenCache: string | null = null;
let tokenPromise: Promise<string> | null = null;

async function getToken(): Promise<string> {
  if (tokenCache) {
    return tokenCache;
  }

  if (tokenPromise) {
    return tokenPromise;
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
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const accessToken = await getToken();

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
