import { ApiService } from "./base.service";

export class TransactionService extends ApiService {
    static async getTransactions(pagination: Pagination, date?: Date, type?: "income" | "outcome") {
        const params = new URLSearchParams();
        params.append("page", pagination.page.toString());
        params.append("limit", pagination.limit.toString());
        if (date) params.append("date", date.toISOString());
        if (type) params.append("type", type);

        return this.request<{ message: string; data: Transaction[]; pagination: Pagination }>(
            `/transaction?${params.toString()}`
        );
    }

    static async createTransaction(transaction: RequestCreateTransaction) {
        return this.request<{ message: string; data: Transaction }>(
            "/transaction",
            {
                method: "POST",
                body: JSON.stringify(transaction),
            }
        );
    }

    static async updateTransaction(transaction: RequestUpdateTransaction) {
        return this.request<{ message: string; data: Transaction }>(
            `/transaction/${transaction.id}`,
            {
                method: "PATCH",
                body: JSON.stringify(transaction),
            }
        );
    }

    static async deleteTransaction(id: string) {
        return this.request<{ message: string }>(
            `/transaction/${id}`,
            { method: "DELETE" }
        );
    }
}