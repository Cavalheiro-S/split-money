"use client"
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Page() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const getTransactions = async () => {
        const { data } = await api.get<{ message: string, data: Transaction[] }>("/transactions")
        console.log(data.data);

        setTransactions(data.data)
        console.log(data.data);
    }

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-4 px-10 mt-10">
            <TableTransaction.Container>
                <TableTransaction.Header title="Transações" subtitle="Aqui você pode ver os seus lançamentos">
                    <TableTransaction.ActionModal trigger={<Button className="place-self-end">Adicionar</Button>} />
                </TableTransaction.Header>
                <TableTransaction.Table data={transactions} />
            </TableTransaction.Container>

        </div>
    )
} 