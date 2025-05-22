"use client"
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { type TransactionFilters, TransactionService } from "@/services/transaction.service";
import { useCallback, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";


export default function Page() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [modalTransactionOpen, setModalTransactionOpen] = useState(false);
    const [transactionSelected, setTransactionSelected] = useState<Transaction | undefined>(undefined);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });

    const [filters, setFilters] = useState<TransactionFilters>({
        date: date,
        type: undefined,
        sort: {
            sortBy: "date",
            sortOrder: "desc"
        },
    });

    const memoizedFilters = useMemo(() => ({
        ...filters,
        date: date
    }), [date, filters]);

    const [loading, setLoading] = useState(true);

    const getTransactions = useCallback(async () => {
        try {
            setLoading(true)
            const data = await TransactionService.getTransactions(pagination, memoizedFilters)
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
    }, [pagination, memoizedFilters])

    const handleEdit = (id: string) => {
        setModalTransactionOpen(true)
        const transaction = id ? transactions.find(transaction => transaction.id === id) : undefined
        setTransactionSelected(transaction)
    }

    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            await TransactionService.deleteTransaction(id)
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
    }, [date, pagination.page, pagination.limit, memoizedFilters])

    useEffect(() => {
        if (!modalTransactionOpen) {
            setTransactionSelected(undefined)
        }
    }, [modalTransactionOpen])

    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-4 px-10 mt-10 bg-gray-100 py-10">
            <TableTransaction.Container>
                <TableTransaction.Header
                    title="Transações"
                    subtitle="Aqui você pode ver os seus lançamentos"
                    onChangeDate={(date) => {
                        setPagination({ ...pagination, page: 1 })
                        setDate(date)
                    }}
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
                    onChangeFilters={(filters) => {
                        setPagination({ ...pagination, page: 1 })
                        setFilters(filters)
                    }}
                    filters={filters}
                />
                <TableTransaction.Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onChange={(page) => setPagination({ ...pagination, page })}
                    limit={pagination.limit}
                    onChangeLimit={(limit) => setPagination({ ...pagination, limit })}
                />
            </TableTransaction.Container>

        </div>
    )
}