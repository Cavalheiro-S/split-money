import { ApiService } from "./base.service";

export class TagService extends ApiService {
    static async getTags() {
        return this.request<{ message: string; data: Tag[]; pagination: Pagination }>(
            `/tag`
        );
    }

    static async createTag(data: RequestCreateTag) {
        return this.request<{ message: string; data: Tag }>(
            "/tag",
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );
    }

    static async updateTag(data: RequestUpdateTag) {
        return this.request<{ message: string; data: Tag }>(
            `/tag/${data.id}`,
            {
                method: "PATCH",
                body: JSON.stringify({ description: data.description }),
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
