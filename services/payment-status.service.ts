import { ApiService } from "./base.service";

export class PaymentStatusService extends ApiService {
  static async getPaymentStatus() {
    return this.request<{ message: string; data: PaymentStatus[] }>(`/payment`);
  }

  static async createPaymentStatus(data: RequestCreatePaymentStatus) {
    return this.request<{ message: string; data: PaymentStatus }>("/payment", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  }

  static async updatePaymentStatus(data: RequestUpdatePaymentStatus) {
    return this.request<{ message: string; data: PaymentStatus }>(
      `/payment/${data.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ description: data.description }),
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  static async deletePaymentStatus(id: string) {
    return await this.request<{ message: string }>(`/payment/${id}`, {
      method: "DELETE",
    });
  }
}
