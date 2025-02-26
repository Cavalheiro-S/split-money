"use client"
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Pagination = {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
}

export default function Page() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [modalTransactionOpen, setModalTransactionOpen] = useState(false);
    const [transactionSelected, setTransactionSelected] = useState<Transaction | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        total: 0,
    })

    const getTransactions = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await api.get<{
                message: string,
                data: Transaction[],
                pagination: Pagination
            }>(`/transactions?page=${pagination.currentPage}&perPage=${pagination.perPage}&date=${date?.toISOString()}`)
            setTransactions(data.data)
            setPagination(data.pagination)
        }
        catch (error) {
            toast.error("Falha ao buscar transações")
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }, [pagination.currentPage, pagination.perPage, date])

    const handleEdit = (id: string) => {
        setModalTransactionOpen(true)
        const transaction = id ? transactions.find(transaction => transaction.id === id) : undefined
        setTransactionSelected(transaction)
    }

    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            await api.delete(`/transaction/${id}`)
            await getTransactions()
            toast.success("Transação deletada com sucesso")

        }
        catch (error) {
            toast.error("Falha ao deletar transação")
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, pagination.currentPage, pagination.perPage])

    useEffect(() => {
        if (!modalTransactionOpen) {
            setTransactionSelected(undefined)
        }
    }, [modalTransactionOpen])

    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-4 px-10 mt-10">
            <TableTransaction.Container>
                <TableTransaction.Header
                    title="Transações"
                    subtitle="Aqui você pode ver os seus lançamentos"
                    onChange={(date) => setDate(date)}
                >
                    <TableTransaction.ActionModal
                        transaction={transactionSelected}
                        open={modalTransactionOpen}
                        onOpenChange={open => setModalTransactionOpen(open)}
                        updateData={getTransactions}
                        trigger={<Button className="place-self-end">
                            Adicionar
                        </Button>} />
                </TableTransaction.Header>
                <TableTransaction.Table
                    hasActions
                    onEditClick={handleEdit}
                    data={transactions}
                    loading={loading}
                    onDeleteClick={handleDelete}
                />
                <TableTransaction.Pagination
                    page={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onChange={(currentPage) => setPagination({ ...pagination, currentPage })}
                />
            </TableTransaction.Container>

        </div>
    )
} 