import { ApiService } from "./base.service";

export class PaymentStatusService extends ApiService {
    static async getPaymentStatus() {

        return this.request<{ message: string; data: PaymentStatus[]}>(
            `/payment`
        );
    }

    static async createPaymentStatus(description: string) {
        return this.request<{ message: string; data: PaymentStatus }>(
            "/payment",
            {
                method: "POST",
                body: JSON.stringify({ description }),
            }
        );
    }

    static async updatePaymentStatus(description: string, id: string) {
        return this.request<{ message: string; data: PaymentStatus }>(
            `/payment/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify({ description }),
            }
        );
    }

    static async deletePaymentStatus(id: string) {
        try {
            return await this.request<{ message: string }>(
                `/payment/${id}`,
                { method: "DELETE" }
            );
        } catch (error) {
            // Repassar o erro original para que seja tratado adequadamente na UI
            throw error;
        }
    }
}