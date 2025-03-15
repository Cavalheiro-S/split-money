import { fetchWithAuth } from "@/utils/data";

export class ApiService {
    protected static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, options);

            if (!response?.ok) {
                const errorData = await response?.json();
                throw new Error(errorData.message || "Erro ao conectar com a API");
            }

            return response?.json();
        } catch (error) {
            console.error("API Error:", error);
            throw new Error("Falha na comunicação com o servidor. Tente novamente.");
        }
    }
}