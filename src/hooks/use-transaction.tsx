import { createTransaction, getTransactions } from "@/services/transaction"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useTransaction = (pagination?: Pagination) => {

    const queryClient = useQueryClient()

    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["transactions", pagination],
        queryFn: ({ queryKey }) => {
            const userId = localStorage.getItem("userId")
            console.log(queryKey);
            if (!userId) return
            return getTransactions({ userId, page: 1, count: 10 })
        },
    })

    const { mutate: transactionCreateMutate, isPending: transactionCreateLoading } = useMutation({
        mutationKey: ['createTransaction'],
        mutationFn: (data: RequestCreateTransaction) => {
            return createTransaction(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }
    })

    return {
        transactions,
        transactionsLoading,
        transactionCreateMutate,
        transactionCreateLoading
    }
}