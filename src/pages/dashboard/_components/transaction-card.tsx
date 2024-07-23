import { TransactionTable } from "components/transaction-table"
import { Dayjs } from "dayjs"
import { useTable } from "hooks/use-table"
import { useTransaction } from "hooks/use-transaction"
import { SetStateAction, useState } from "react"
import { toast } from "react-toastify"

type CardProps = {
    type: TransactionType,
    title: string
}

export const TransactionCard = ({ type, title }: CardProps) => {
    const { setPage, setCount, page, count } = useTable()
    const [dateSelected, setDateSelected] = useState(new Date())

    const {
        transactions,
        transactionsLoading,
        transactionDeleteMutate
    }
        = useTransaction({
            page: page,
            count: count,
            type,
            period: dateSelected
        })

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
        <TransactionTable
            onDelete={handleDelete}
            onChangeDate={value => handleUpdateDate(value, setDateSelected)}
            handleSetPage={setPage}
            handleSetCount={setCount}
            data={transactions}
            isLoading={transactionsLoading}
            title={title} />
    )
}