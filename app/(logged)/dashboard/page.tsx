"use client"

import { TableTransaction } from "@/components/transaction-table";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Page() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const getTransactions = async () => {
        const { data } = await api.get<{ message: string, data: Transaction[] }>("/transactions")
        setTransactions(data.data)
    }

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10">
            <TableTransaction.Container>
                <TableTransaction.Header title="Últimos lançamentos" subtitle="Aqui você pode ver os seus lançamentos recentes" />
                <TableTransaction.Table data={transactions} />
            </TableTransaction.Container>

            <TableTransaction.Container>
                <TableTransaction.Header title="Últimas despesas" subtitle="Aqui você pode ver os seus lançamentos" />
                <TableTransaction.Table data={transactions} />
            </TableTransaction.Container>
        </div>
    )
} 