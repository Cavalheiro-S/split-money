import { ApiService } from "./base.service";

export type TransactionFilters = {
    date?: Date;
    type?: "income" | "outcome";
    sort?: {
        sortBy: "description" | "date" | "amount" | "type" | "category" | "payment_status";
        sortOrder: "asc" | "desc";
    }
    status?: string;
}

export class TransactionService extends ApiService {
    static async getTransactions(pagination: Pagination, filters?: TransactionFilters) {
        const params = new URLSearchParams();
        params.append("page", pagination.page.toString());
        params.append("limit", pagination.limit.toString());
        if (filters?.date) params.append("date", filters?.date.toISOString());
        if (filters?.type) params.append("type", filters?.type);
        if (filters?.status) params.append("status", filters?.status);
        if (filters?.sort) {
            params.append("sortBy", filters.sort.sortBy);
            params.append("sortOrder", filters.sort.sortOrder);
        }

        return this.request<{ message: string; data: ResponseGetTransactions[]; pagination: Pagination }>(
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