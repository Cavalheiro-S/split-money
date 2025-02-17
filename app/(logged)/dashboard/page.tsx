"use client"

import { TableTransaction } from "@/components/transaction-table";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Page() {
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [outcomes, setOutcomes] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    const getIncomes = async () => {
        try {
            setLoading(true)
            const { data } = await api.get<{ message: string, data: Transaction[] }>("/transactions?page=1&limit=10&type=income")
            setIncomes(data.data)
        }
        catch (error) {
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }

    const getOutcomes = async () => {
        try {
            setLoading(true)
            const { data } = await api.get<{ message: string, data: Transaction[] }>("/transactions?page=1&limit=10&type=outcome")
            setOutcomes(data.data)
        }
        catch (error) {
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getIncomes()
        getOutcomes()
    }, [])

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10">
            <TableTransaction.Container>
                <TableTransaction.Header title="Últimos lançamentos" subtitle="Aqui você pode ver os seus lançamentos recentes" />
                <TableTransaction.Table loading={loading} data={incomes} />
            </TableTransaction.Container>

            <TableTransaction.Container>
                <TableTransaction.Header title="Últimas despesas" subtitle="Aqui você pode ver os suas despesas recentes" />
                <TableTransaction.Table loading={loading} data={outcomes} />
            </TableTransaction.Container>
        </div>
    )
} 