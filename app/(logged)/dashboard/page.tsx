"use client"

import { TableTransaction } from "@/components/transaction-table";
import { TransactionService } from "@/services/transaction.service";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
    const [incomes, setIncomes] = useState<ResponseGetTransactions[]>([]);
    const [outcomes, setOutcomes] = useState<ResponseGetTransactions[]>([]);
    const [loadingIncome, setLoadingIncome] = useState(false);
    const [loadingOutcome, setLoadingOutcome] = useState(false);
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
            setLoadingIncome(true)
            const data = await TransactionService.getTransactions(paginationIncome, { date: dateIncome, type: "income" })
            setIncomes(data.data)
            setPaginationIncome(data.pagination)
        }
        catch (error) {
            console.log({ error });
        }
        finally {
            setLoadingIncome(false)
        }
    }, [paginationIncome.page, paginationIncome.limit, dateIncome])

    const getOutcomes = useCallback(async () => {
        try {
            setLoadingOutcome(true)
            const data = await TransactionService.getTransactions(paginationOutcome, { date: dateOutcome, type: "outcome" })
            setOutcomes(data.data)
            setPaginationOutcome(data.pagination)
        }
        catch (error) {
            console.log({ error });
        }
        finally {
            setLoadingOutcome(false)
        }
    }, [paginationOutcome.page, paginationOutcome.limit, dateOutcome])

    useEffect(() => {
        if (paginationIncome.page && paginationIncome.limit) {
            getIncomes()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateIncome, paginationIncome.page, paginationIncome.limit])

    useEffect(() => {
        if (paginationOutcome.page && paginationOutcome.limit) {
            getOutcomes()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateOutcome, paginationOutcome.page, paginationOutcome.limit])

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
            <TableTransaction.Container>
                <TableTransaction.Header onChangeDate={(date) => {
                    setDateIncome(date)
                    setPaginationIncome({ ...paginationIncome, page: 1 })
                }} title="Últimos lançamentos" subtitle="Aqui você pode ver os seus lançamentos recentes" />
                <TableTransaction.Table loading={loadingIncome} data={incomes} />
                <TableTransaction.Pagination
                    page={paginationIncome.page}
                    totalPages={paginationIncome.totalPages}
                    onChange={(page) => setPaginationIncome({ ...paginationIncome, page })}
                    limit={paginationIncome.limit}
                    onChangeLimit={(limit) => setPaginationIncome({ ...paginationIncome, limit })}
                />
            </TableTransaction.Container>

            <TableTransaction.Container>
                <TableTransaction.Header
                    onChangeDate={(date) => {
                        setDateOutcome(date)
                        setPaginationOutcome({ ...paginationOutcome, page: 1 })
                    }}
                    type="outcome"
                    title="Últimas despesas"
                    subtitle="Aqui você pode ver os suas despesas recentes" />
                <TableTransaction.Table loading={loadingOutcome} data={outcomes} />
                <TableTransaction.Pagination
                    page={paginationOutcome.page}
                    totalPages={paginationOutcome.totalPages}
                    onChange={(page) => setPaginationOutcome({ ...paginationOutcome, page })}
                    limit={paginationOutcome.limit}
                    onChangeLimit={(limit) => setPaginationOutcome({ ...paginationOutcome, limit })}
                />
            </TableTransaction.Container>
        </div>
    )
} 