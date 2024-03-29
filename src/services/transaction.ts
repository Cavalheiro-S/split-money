import { api } from "@/data/axios";

export const getTransactions = async (querys: RequestGetTransactions) => {
    const url = "/transaction"
    const response = await api.get<ApiBase<ResponseGetTransactions>>(url, {
        params: {
            userId: querys.userId,
            page: querys.page,
            count: querys.count
        }
    })
    return response.data.data
}

export const createTransaction = async (data: RequestCreateTransaction) => {
    const url = "/transaction"
    const response = await api.post<ApiBase<ResponseCreateTransaction>>(url, data)
    return response.data.data
}

export const deleteTransaction = async (id: string) => {
    const url = `/transaction?id=${id}`
    const response = await api.delete(url)
    return response.data.data
}