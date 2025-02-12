"use client"
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Page() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [modalTransactionOpen, setModalTransactionOpen] = useState(false);
    const [transactionSelected, setTransactionSelected] = useState<Transaction | undefined>(undefined);

    const getTransactions = async () => {
        const { data } = await api.get<{ message: string, data: Transaction[] }>("/transactions")
        setTransactions(data.data)
    }

    const handleEdit = (id: string) => {
        setModalTransactionOpen(true)
        const transaction = id ? transactions.find(transaction => transaction.id === id) : undefined
        setTransactionSelected(transaction)
    }

    useEffect(() => {
        getTransactions()
    }, [transactionSelected])

    useEffect(() => {
        if (!modalTransactionOpen) {
            setTransactionSelected(undefined)
        }
    }, [modalTransactionOpen])

    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-4 px-10 mt-10">
            <TableTransaction.Container>
                <TableTransaction.Header title="Transações" subtitle="Aqui você pode ver os seus lançamentos">
                    <TableTransaction.ActionModal transaction={transactionSelected} open={modalTransactionOpen} onOpenChange={open => setModalTransactionOpen(open)} trigger={<Button className="place-self-end">Adicionar</Button>} />
                </TableTransaction.Header>
                <TableTransaction.Table hasActions onEditClick={handleEdit} data={transactions} />
            </TableTransaction.Container>

        </div>
    )
} 