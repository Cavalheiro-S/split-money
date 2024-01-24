import { getTransactions } from "@/services/transaction"
import { useQuery } from "@tanstack/react-query"

export const useTransaction = (pagination?: Pagination) => {

    const transactionsQuery = useQuery({
        queryKey: ["transactions", { count: pagination?.count }, { page: pagination?.page }],
        queryFn: async ({ queryKey }) => {
            console.log(queryKey);
            return await getTransactions({ userId: "6c21f4ee-57ef-44a3-b7fc-bb2b871855d8", page: 1, count: 10 })
        },
    })

    return {
        transactionsQuery
    }
}