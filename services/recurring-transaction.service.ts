import { ApiService } from "./base.service";

export type RecurringTransactionFilters = {
    date?: Date;
    type?: "income" | "outcome";
    sort?: {
        sortBy: "description" | "date" | "amount" | "type" | "category" | "payment_status" | "frequency";
        sortOrder: "asc" | "desc";
    }
    status?: string;
    isActive?: boolean;
}

export class RecurringTransactionService extends ApiService {
    static async getRecurringTransactions(pagination: Pagination, filters?: RecurringTransactionFilters) {
        const params = new URLSearchParams();
        params.append("page", pagination.page.toString());
        params.append("limit", pagination.limit.toString());
        if (filters?.date) params.append("date", filters?.date.toISOString());
        if (filters?.type) params.append("type", filters?.type);
        if (filters?.status) params.append("status", filters?.status);
        if (filters?.isActive !== undefined) params.append("isActive", filters.isActive.toString());
        if (filters?.sort) {
            params.append("sortBy", filters.sort.sortBy);
            params.append("sortOrder", filters.sort.sortOrder);
        }

        return this.request<{ message: string; data: ResponseGetRecurringTransactions[]; pagination: Pagination }>(
            `/recurring-transaction?${params.toString()}`
        );
    }

    static async createRecurringTransaction(transaction: RequestCreateRecurringTransaction) {
        return this.request<{ message: string; data: RecurringTransaction }>(
            "/recurring-transaction",
            {
                method: "POST",
                body: JSON.stringify(transaction),
            }
        );
    }

    static async updateRecurringTransaction(transaction: RequestUpdateRecurringTransaction) {
        return this.request<{ message: string; data: RecurringTransaction }>(
            `/recurring-transaction/${transaction.id}`,
            {
                method: "PATCH",
                body: JSON.stringify(transaction),
            }
        );
    }

    static async deleteRecurringTransaction(id: string) {
        return this.request<{ message: string }>(
            `/recurring-transaction/${id}`,
            { method: "DELETE" }
        );
    }

    static async bulkDeleteRecurringTransactions(ids: string[]) {
        return this.request<BulkDeleteRecurringResponse>(
            "/recurring-transaction/bulk-delete",
            {
                method: "POST",
                body: JSON.stringify({ ids }),
            }
        );
    }

    static async toggleRecurringTransactionStatus(id: string, isActive: boolean) {
        return this.request<{ message: string; data: RecurringTransaction }>(
            `/recurring-transaction/${id}/toggle-status`,
            {
                method: "PATCH",
                body: JSON.stringify({ isActive }),
            }
        );
    }
}
