"use client"

import { TableTransaction } from "@/components/transaction-table";
import { api } from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [outcomes, setOutcomes] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [dateIncome, setDateIncome] = useState<Date | undefined>(new Date());
    const [dateOutcome, setDateOutcome] = useState<Date | undefined>(new Date());
    const [paginationIncome, setPaginationIncome] = useState<Pagination>({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    })
    const [paginationOutcome, setPaginationOutcome] = useState<Pagination>({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    })

    const getIncomes = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await api.get<{
                message: string,
                data: Transaction[],
                pagination: Pagination
            }>(
                `/transactions?page=${paginationIncome.page}&limit=${paginationIncome.limit}&date=${dateIncome?.toISOString()}&type=income`)
            setIncomes(data.data)
            setPaginationIncome(data.pagination)
        }
        catch (error) {
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }, [paginationIncome.page, paginationIncome.limit, dateIncome])

    const getOutcomes = useCallback(async () => {
        try {
            setLoading(true)
            const { data } = await api.get<{
                message: string,
                data: Transaction[],
                pagination: Pagination
            }>(`/transactions?page=${paginationOutcome.page}&limit=${paginationOutcome.limit}&date=${dateOutcome?.toISOString()}&type=outcome`)
            setOutcomes(data.data)
            setPaginationOutcome(data.pagination)
        }
        catch (error) {
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }, [paginationOutcome.page, paginationOutcome.limit, dateOutcome])

    useEffect(() => {
        getIncomes()
        getOutcomes()
    }, [dateIncome, dateOutcome, paginationIncome.page, paginationIncome.limit, paginationOutcome.page, paginationOutcome.limit])

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10">
            <TableTransaction.Container>
                <TableTransaction.Header onChange={(date) => setDateIncome(date)} title="Últimos lançamentos" subtitle="Aqui você pode ver os seus lançamentos recentes" />
                <TableTransaction.Table loading={loading} data={incomes} />
                <TableTransaction.Pagination
                    page={paginationIncome.page}
                    totalPages={paginationIncome.totalPages}
                    onChange={(page) => setPaginationIncome({ ...paginationIncome, page })}
                />
            </TableTransaction.Container>

            <TableTransaction.Container>
                <TableTransaction.Header onChange={(date) => setDateOutcome(date)} title="Últimas despesas" subtitle="Aqui você pode ver os suas despesas recentes" />
                <TableTransaction.Table loading={loading} data={outcomes} />
                <TableTransaction.Pagination
                    page={paginationOutcome.page}
                    totalPages={paginationOutcome.totalPages}
                    onChange={(page) => setPaginationOutcome({ ...paginationOutcome, page })}
                />
            </TableTransaction.Container>
        </div>
    )
} 