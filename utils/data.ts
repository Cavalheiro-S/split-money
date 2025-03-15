export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch("/api/auth/get-token");

    if (response.status === 401) {
      window.location.href = "/sign-in"; // Redireciona o usuário
      return; // Encerra a execução da função
    }

    const { accessToken } = await response.json();

    if (!accessToken) {
      window.location.href = "/sign-in";
      return;
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar token:", error);
    window.location.href = "/sign-in"; // Redireciona se houver erro
  }
}
