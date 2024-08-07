import { api } from "data/axios";

export const getTransactions = async (filter: FilterTransaction) => {
    const url = "/transaction"
    const response = await api.get<ApiBase<Pagination<ResponseGetTransactions>>>(url, { params: filter })
    return response.data.data
}

export const createTransaction = async (data: RequestCreateTransaction) => {
    const url = "/transaction"
    const response = await api.post<ApiBase<ResponseCreateTransaction>>(url, data)
    return response.data.data
}

export const updateTransaction = async (data: RequestUpdateTransaction) => {
    const url = `/transaction?id=${data.id}`
    const response = await api.patch(url, data)
    return response.data.data
}

export const deleteTransaction = async (id: string) => {
    const url = `/transaction?id=${id}`
    const response = await api.delete(url)
    return response.data.data
}