import { ApiService } from "./base.service";

export class CategoryService extends ApiService {
    static async getCategories() {
        return this.request<{ message: string; data: Category[]; pagination: Pagination }>(
            `/category`
        );
    }

    static async createCategory(data: RequestCreateCategory) {
        return this.request<{ message: string; data: Category }>(
            "/category",
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );
    }

    static async updateCategory(data: RequestUpdateCategory) {
        return this.request<{ message: string; data: Category }>(
            `/category/${data.id}`,
            {
                method: "PATCH",
                body: JSON.stringify({ description: data.description }),
            }
        );
    }

    static async deleteCategory(id: string) {
        try {
            return await this.request<{ message: string }>(
                `/category/${id}`,
                { method: "DELETE" }
            );
        } catch (error) {
            // Repassar o erro original para que seja tratado adequadamente na UI
            throw error;
        }
    }
}
