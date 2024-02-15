import { AuthContext } from "@/context/auth-context"
import { createTransaction, getTransactions } from "@/services/transaction"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"

export const useTransaction = (pagination?: Pagination) => {

    const queryClient = useQueryClient()
    const { user } = useContext(AuthContext)

    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["transactions", pagination],
        queryFn: ({ queryKey }) => {
            if (!user?.id) return null
            return getTransactions({ userId: user.id, page: 1, count: 10 })
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