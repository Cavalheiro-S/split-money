import { ApiService } from "./base.service";

export class TagService extends ApiService {
    static async getTags() {
        return this.request<{ message: string; data: Tag[]; pagination: Pagination }>(
            `/tag`
        );
    }

    static async createTag(description: string) {
        return this.request<{ message: string; data: Tag }>(
            "/tag",
            {
                method: "POST",
                body: JSON.stringify({ description }),
            }
        );
    }

    static async updateTag(description: string, id: string) {
        return this.request<{ message: string; data: Tag }>(
            `/tag/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify({ description }),
            }
        );
    }

    static async deleteTag(id: string) {
        try {
            return await this.request<{ message: string }>(
                `/tag/${id}`,
                { method: "DELETE" }
            );
        } catch (error) {
            // Repassar o erro original para que seja tratado adequadamente na UI
            throw error;
        }
    }
}
