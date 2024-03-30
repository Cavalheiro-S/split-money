import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from "@/services/transaction"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useTransaction = (filter?: FilterTransaction) => {
    const queryClient = useQueryClient()

    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["transactions", filter],
        queryFn: () => getTransactions(filter ?? {} as FilterTransaction),
    })

    const transactionCreateMutate = useMutation({
        mutationKey: ['createTransaction'],
        mutationFn: (data: RequestCreateTransaction) => createTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }
    })

    const transactionUpdateMutate = useMutation({
        mutationKey: ['updateTransaction'],
        mutationFn: (data: RequestUpdateTransaction) => updateTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }
    })

    const transactionDeleteMutate = useMutation({
        mutationKey: ['deleteTransaction'],
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        }
    })

    return {
        transactions,
        transactionsLoading,
        transactionCreateMutate,
        transactionUpdateMutate,
        transactionDeleteMutate
    }
}