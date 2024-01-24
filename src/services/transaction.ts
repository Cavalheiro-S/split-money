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