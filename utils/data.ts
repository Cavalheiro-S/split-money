import { AuthService } from "@/services/auth.service";

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

    return apiResponse;
  } catch (error) {
    console.error("Erro ao buscar token:", error);
    throw error;
  }
}
