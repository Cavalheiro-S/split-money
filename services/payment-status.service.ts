import { ApiService } from "./base.service";

export class PaymentStatusService extends ApiService {
    static async getPaymentStatus() {

        return this.request<{ message: string; data: PaymentStatus[]; pagination: Pagination }>(
            `/payment`
        );
    }

    static async createPaymentStatus(status: string) {
        return this.request<{ message: string; data: PaymentStatus }>(
            "/payment",
            {
                method: "POST",
                body: JSON.stringify({ status }),
            }
        );
    }

    static async updatePaymentStatus(status: string, id: string) {
        return this.request<{ message: string; data: PaymentStatus }>(
            `/payment/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }
        );
    }

    static async deletePaymentStatus(id: string) {
        return this.request<{ message: string }>(
            `/payment/${id}`,
            { method: "DELETE" }
        );
    }
}