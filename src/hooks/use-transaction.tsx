import { createTransaction, getTransactions } from "@/services/transaction"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export const useTransaction = (pagination?: Pagination) => {
    const queryClient = useQueryClient()
    const [userId, setUserId] = useState("")

    useEffect(() => {
        const id = localStorage.getItem("userId")
        if (id)
            setUserId(id)
    }, [])


    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["transactions", pagination, userId],
        queryFn: ({ queryKey }) => {
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