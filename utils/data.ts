export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch("/api/auth/get-token");
    const { accessToken } = await response.json();
  
    if (!accessToken) {
      throw new Error("Usuário não autenticado");
    }
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }