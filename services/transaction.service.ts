import { RequestCreateTransaction, RequestUpdateTransaction, Transaction } from "@/types/transaction";
import { fetchWithAuth } from "@/utils/data";

export class TransactionService {

    static async getTransactions(pagination: Pagination, date: Date | undefined, type?: "income" | "outcome") {
        const params = new URLSearchParams()
        params.append("page", pagination.page.toString())
        params.append("limit", pagination.limit.toString())
        params.append("date", date?.toISOString() || "")
        if (type) {
            params.append("type", type)
        }
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/transaction?${params.toString()}`)
        return response.json() as Promise<{
            message: string,
            data: Transaction[],
            pagination: Pagination
        }>
    }

    static async createTransaction(transaction: RequestCreateTransaction) {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
            method: "POST",
            body: JSON.stringify(transaction)
        })
        return response.json() as Promise<{ message: string, data: Transaction }>
    }

    static async updateTransaction(transaction: RequestUpdateTransaction) {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${transaction.id}`, {
            method: "PUT",
            body: JSON.stringify(transaction)
        })
        return response.json() as Promise<{ message: string, data: Transaction }>
    }

    static async deleteTransaction(id: string) {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${id}`, {
            method: "DELETE",
        })
        return response.json() as Promise<{ message: string }>
    }
}