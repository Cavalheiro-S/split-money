"use client"
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { type TransactionFilters, TransactionService } from "@/services/transaction.service";
import { useCallback, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";


export default function Page() {
    const [transactions, setTransactions] = useState<ResponseGetTransactions[]>([]);
    const [modalTransactionOpen, setModalTransactionOpen] = useState(false);
    const [transactionSelected, setTransactionSelected] = useState<ResponseGetTransactions | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

    const handleDeleteSuccess = async () => {
        await getTransactions()
        setSelectedIds([])
    }

    const handleClearSelection = () => {
        setSelectedIds([])
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

    const totalAmount = transactions.reduce((acc, item) => {
        return item.type === "income" ? acc + item.amount : acc - item.amount
    }, 0);

    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-6 px-6 lg:px-10 mt-6 lg:mt-10 bg-gray-50 py-6 lg:py-10">
            <TableTransaction.Container>
                <TableTransaction.Header
                    title="Transações"
                    subtitle="Gerencie seus lançamentos financeiros"
                    totalTransactions={transactions.length}
                    totalAmount={totalAmount}
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
                        trigger={
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Adicionar Transação
                            </Button>
                        } 
                    />
                </TableTransaction.Header>
                
                <TableTransaction.StatsCards transactions={transactions} />
                
                <TableTransaction.BulkActionsBar
                    selectedIds={selectedIds}
                    transactions={transactions}
                    onClearSelection={handleClearSelection}
                    onDeleteSuccess={handleDeleteSuccess}
                />
                
                <TableTransaction.Table
                    hasActions
                    onEditClick={handleEdit}
                    data={transactions}
                    loading={loading}
                    onDeleteSuccess={handleDeleteSuccess}
                    onChangeFilters={(filters) => {
                        setPagination({ ...pagination, page: 1 })
                        setFilters(filters)
                    }}
                    filters={filters}
                    showSearch={true}
                    enableBulkSelection={true}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                />
                <TableTransaction.Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    limit={pagination.limit}
                    totalItems={pagination.total}
                    onChange={(page) => setPagination({ ...pagination, page })}
                    onChangeLimit={(limit) => setPagination({ ...pagination, limit })}
                    filteredDataLength={transactions.length}
                    showAlways
                />
            </TableTransaction.Container>
        </div>
    )
}