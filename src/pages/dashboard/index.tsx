
import { Space } from "antd";
import { Dayjs } from "dayjs";
import { useTransaction } from "hooks/use-transaction";
import moment from "moment";
import { SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import TableRecord from "../transaction/_components/Record/table-record";

export default function Page() {
    const [dateSelectedIncome, setDateSelectedIncome] = useState(new Date())
    const [dateSelectedOutcome, setDateSelectedOutcome] = useState(new Date())
    const {
        transactions: transactionsIncome,
        transactionsLoading: transactionsLoadingIncome,
        transactionUpdateMutate }
        = useTransaction({
            page: 1,
            count: 10,
            type: "income",
            period: dateSelectedIncome
        })
    const {
        transactions: transactionsOutcome,
        transactionsLoading: transactionsLoadingOutcome,
        transactionDeleteMutate
    } = useTransaction(
        {
            page: 1,
            count: 10,
            type: "outcome",
            period: dateSelectedOutcome
        })

    const handleEdit = async (data: ResponseGetTransactions) => {
        try {
            const dataMap: RequestUpdateTransaction = {
                id: data.id,
                amount: data.amount,
                category: data.category,
                date: moment(data.date).format('YYYY-MM-DD'),
                description: data.description,
                type: data.type
            }
            await transactionUpdateMutate.mutateAsync(dataMap, {
                onSuccess: () => {
                    toast.success('Transação atualizada com sucesso')
                }
            })
        } catch (error) {
            console.error(error)
            toast.error('Falha ao atualizar a transação')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await transactionDeleteMutate.mutateAsync(id)
            toast.success('Transação deletada com sucesso')
        } catch (error) {
            console.log(error)
            toast.error('Não foi possível deletar a transação')
        }
    }

    const handleUpdateDate = (value: Dayjs | null, setData: (value: SetStateAction<Date>) => void) => {
        if (value) {
            const date = value?.toDate()
            setData(date)
        }
    }

    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-4 px-10 mt-10">
            <TableRecord
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeDate={value => handleUpdateDate(value, setDateSelectedIncome)}
                data={transactionsIncome ?? []}
                isLoading={transactionsLoadingIncome}
                title="Últimos Lançamentos" />
            <TableRecord
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeDate={value => handleUpdateDate(value, setDateSelectedOutcome)}
                data={transactionsOutcome ?? []}
                isLoading={transactionsLoadingOutcome}
                title="Últimas Despesas" />
        </div>
    )
}