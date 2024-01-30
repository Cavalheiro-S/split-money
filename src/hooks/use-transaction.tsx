import { getTransactions } from "@/services/transaction"
import { useQuery } from "@tanstack/react-query"

export const useTransaction = (pagination?: Pagination) => {

    const transactionsQuery = useQuery({
        queryKey: ["transactions", { count: pagination?.count }, { page: pagination?.page }],
        queryFn: async ({ queryKey }) => {
            console.log(queryKey);
            return await getTransactions({ userId: "a82529a0-819b-4485-99d2-ec9a4f5bce0a", page: 1, count: 10 })
        },
    })

    return {
        transactionsQuery
    }
}